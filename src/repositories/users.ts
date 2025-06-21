import { db } from "@/drizzle/db";
import { projects, users, userRoles, roles, rolePermissions, permissions } from "@/drizzle/schema"; // Ensure all necessary schemas are imported
import { unstable_cache as cache } from "next/cache";
import { eq, count, sql, and, like, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { UserType } from "@/types/user";
import { z } from "zod";
import { updateProfileInformationFormSchema } from "@/app/api/internal/account/schema";
import { hasLinkedGithub } from "@/lib/utils";
import { SALT_ROUNDS } from "@/lib/IAM";

/**
 * not everywhere is required to use cache, for example this function
 * is used in the login page, and we don't want to cache the user
 */
// for login, so no need to hide password, doesn't matter the user type. it's not for return to client
export const getUserByEmail = async (email: string) => {
    return await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.email, email),
    });
};

export const updateUserPassword = async (
    userId: string,
    newPassword: string,
) => {
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    return await db
        .update(users)
        .set({
            password: hashedPassword,
        })
        .where(eq(users.id, userId));
};

export const updateUserEmail = async (userId: string, newEmail: string) => {
    return await db
        .update(users)
        .set({
            email: newEmail,
        })
        .where(eq(users.id, userId));
};

export const createUser = async (user: typeof users.$inferInsert) => {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
    };

    return await db.insert(users).values({
        ...userWithHashedPassword,
        type: UserType.USER,
    });
};

export type GetUserRolesAndRolePermissions_C_ReturnType = Awaited<
    ReturnType<typeof getUserRolesAndRolePermissions_C>
>;

export type GetUserRolesAndRolePermissions_C_Tag =
    | `getUserRolesAndRolePermissions_C:${string}`
    | `getUserRolesAndRolePermissions_C`;

// IMPORTANT: This function has been further refactored to perform multiple, extremely simpler queries
// by fetching each level of relation separately, to maximize compatibility with
// MariaDB 10.4's SQL parser.
// It hides the password column for client safety.
export const getUserRolesAndRolePermissions_C = async (userId: string) => {
    return await cache(
        async (userId: string) => {
            // 1. Fetch the user without any relations initially
            const user = await db.query.users.findFirst({
                columns: {
                    password: false, // Exclude password for client safety
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phoneNumber: true,
                    isActive: true,
                    hasLinkedGithub: true,
                    profileUrl: true,
                    type: true,
                    skillSet: true,
                    description: true,
                    joinSince: true,
                    leaveAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
                where: eq(users.id, userId),
            });

            if (!user) {
                return null;
            }

            // 2. Fetch user roles for the fetched user, without directly fetching the 'role' object
            const fetchedUserRoles = await db.query.userRoles.findMany({
                where: eq(userRoles.userId, user.id),
                // No 'with' clause here to keep the SQL simple
            });

            // 3. Collect all unique role IDs from fetchedUserRoles
            const roleIds = [...new Set(fetchedUserRoles.map(ur => ur.roleId))];
            let fetchedRoles: typeof roles.$inferSelect[] = [];
            if (roleIds.length > 0) {
                 // Fetch roles separately
                fetchedRoles = await db.query.roles.findMany({
                    where: or(...roleIds.map(id => eq(roles.id, id))),
                });
            }


            // 4. Collect all unique permission IDs from the roles' rolePermissions
            const allRolePermissions: typeof rolePermissions.$inferSelect[] = [];
            let permissionIds: number[] = [];

            if (fetchedRoles.length > 0) {
                // Fetch role permissions for all fetched roles
                for (const roleItem of fetchedRoles) {
                    const rp = await db.query.rolePermissions.findMany({
                        where: eq(rolePermissions.roleId, roleItem.id),
                    });
                    allRolePermissions.push(...rp);
                    permissionIds.push(...rp.map(p => p.permissionId));
                }
                permissionIds = [...new Set(permissionIds)]; // Get unique permission IDs
            }

            let fetchedPermissions: typeof permissions.$inferSelect[] = [];
            if (permissionIds.length > 0) {
                // Fetch permissions separately
                fetchedPermissions = await db.query.permissions.findMany({
                    where: or(...permissionIds.map(id => eq(permissions.id, id))),
                });
            }

            // 5. Manually reconstruct the nested object structure
            const userRolesWithDetails = fetchedUserRoles.map(ur => {
                const associatedRole = fetchedRoles.find(r => r.id === ur.roleId);
                let rolePermissionsWithDetails: (typeof rolePermissions.$inferSelect & { permission?: typeof permissions.$inferSelect })[] = [];

                if (associatedRole) {
                    // Filter role permissions for this specific role
                    const currentRolePermissions = allRolePermissions.filter(rp => rp.roleId === associatedRole.id);

                    rolePermissionsWithDetails = currentRolePermissions.map(rp => {
                        const associatedPermission = fetchedPermissions.find(p => p.id === rp.permissionId);
                        return {
                            ...rp,
                            permission: associatedPermission,
                        };
                    });
                }

                return {
                    ...ur,
                    role: associatedRole ? { ...associatedRole, rolePermissions: rolePermissionsWithDetails } : undefined,
                };
            });

            // Manually attach the combined roles data back to the user object
            return {
                ...user,
                userRoles: userRolesWithDetails,
            };
        },
        [], // Dependencies for cache. Empty means it depends only on `userId` which is passed later.
        {
            tags: [
                `getUserRolesAndRolePermissions_C:${userId}`,
                `getUserRolesAndRolePermissions_C`,
            ],
        },
    )(userId);
};


export const deleteUserById = async (userId: string, requestDeleteByUserId: string) => {
    return await db.transaction(async (transaction) => {
        const ownedProjects = await transaction.query.projects.findMany({
            where: (table, { eq }) => eq(table.userId, userId),
        });

        // transfer project to the one who request to delete the user
        for (const project of ownedProjects) {
            await transaction.update(projects).set({
                userId: requestDeleteByUserId,
            }).where(eq(projects.id, project.id));
        }

        // allow only delete member
        return await transaction
            .delete(users)
            .where(and(eq(users.id, userId), eq(users.type, UserType.USER)));
    });
};

export type GetUsers_C_Tag = `getUsers_C`;

export const getAllUsers = async () => {
    return await db.query.users.findMany({
        columns: {
            password: false,
        },
        where: (table, { eq, and }) =>
            and(
                eq(table.type, UserType.USER),
                eq(table.hasLinkedGithub, hasLinkedGithub),
            ),
    });
};

export const getUsersBySearch = async (
    search: string,
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    return await db.query.users.findMany({
        columns: {
            password: false,
            createdAt: false,
            updatedAt: false,
        },
        where: (table, { eq, and, like, or }) =>
            and(
                eq(table.type, UserType.USER),
                eq(table.hasLinkedGithub, hasLinkedGithub),
                or(
                    like(table.firstName, `%${search}%`),
                    like(table.lastName, `%${search}%`),
                ),
            ),
        limit: rowsPerPage,
    });
};

export const getUserByIdRegardLessOfLinkedGithub = async (userId: string) => {
    return await db.query.users.findFirst({
        columns: {
            password: false,
        },
        where: (table, { eq, and }) => and(eq(table.id, userId), eq(table.type, UserType.USER)),
    });
};

export const getUserById = async (userId: string) => {
    return await db.query.users.findFirst({
        with: {
            oauthProviders: {
                columns: {
                    providerUserId: true,
                    accessToken: true,
                },
            },
        },
        columns: {
            password: false,
        },
        where: (table, { eq, and }) =>
            and(
                eq(table.id, userId),
                eq(table.type, UserType.USER),
                eq(table.hasLinkedGithub, hasLinkedGithub),
            ),
    });
};

export const getUsers = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return await db.query.users.findMany({
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
        columns: {
            password: false,
        },
        where: (table, { eq, and, like }) =>
            and(
                eq(table.type, UserType.USER),
                or(
                    like(table.firstName, `%${search}%`),
                    like(table.lastName, `%${search}%`),
                ),
            ),
    });
};

export const getUsersTotalRow = async (search: string = "") => {
    const totalRows = await db
        .select({ count: count() })
        .from(users)
        .where(
            and(
                eq(users.type, UserType.USER),
                or(
                    like(users.firstName, `%${search}%`),
                    like(users.lastName, `%${search}%`),
                ),
            ),
        );
    return totalRows[0].count;
};

export const updateUserHasLinkedGithubByUserId = async (
    userId: string,
    attributes: { hasLinkedGithub: boolean },
) => {
    return await db
        .update(users)
        .set({
            hasLinkedGithub: attributes.hasLinkedGithub,
        })
        .where(eq(users.id, userId));
};

export const updateUserProfileInformation = async (
    userId: string,
    body: z.infer<typeof updateProfileInformationFormSchema>,
) => {
    return await db
        .update(users)
        .set({
            firstName: body.firstName,
            lastName: body.lastName,
            profileUrl: body.profileLogo,
            description: body.description,
            skillSet: body.skillSet,
        })
        .where(eq(users.id, userId));
};
