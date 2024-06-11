import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { unstable_cache as cache } from "next/cache";
import { eq, count, sql, and, like } from "drizzle-orm";
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

export type GetUserRolesAndRolePermissions_C_Tag =
    | `getUserRolesAndRolePermissions_C:${string}`
    | `getUserRolesAndRolePermissions_C`;
// important, do not use this function to show client
export const getUserRolesAndRolePermissions_C = async (userId: string) => {
    return await cache(
        async (userId: string) => {
            return await db.query.users.findFirst({
                columns: {
                    password: false,
                },
                where: (table, { eq }) => eq(table.id, userId),
                with: {
                    userRoles: {
                        with: {
                            role: {
                                with: {
                                    rolePermissions: {
                                        with: {
                                            permission: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        },
        [],
        {
            tags: [
                `getUserRolesAndRolePermissions_C:${userId}`,
                `getUserRolesAndRolePermissions_C`,
            ],
        },
    )(userId);
};

export const deleteUserById = async (userId: string) => {
    return await db.transaction(async (transaction) => {
        // don't worry about foreign key, we have cascade delete
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
        where: (table, { eq, and, like }) =>
            and(
                eq(table.type, UserType.USER),
                eq(table.hasLinkedGithub, hasLinkedGithub),
                like(table.firstName, `%${search}%`),
            ),
        limit: rowsPerPage,
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
                like(table.firstName, `%${search}%`),
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
                like(users.firstName, `%${search}%`),
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
