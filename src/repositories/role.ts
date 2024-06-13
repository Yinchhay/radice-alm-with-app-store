import { db } from "@/drizzle/db";
import {
    roles,
    userRoles,
    users,
    rolePermissions,
    permissions,
} from "@/drizzle/schema";
import { PermissionsToFilterIfNotSuperAdmin } from "@/lib/filter";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { UserType } from "@/types/user";
import { count, eq, sql, and, inArray, like } from "drizzle-orm";

export const createRole = async (role: typeof roles.$inferInsert) => {
    return await db.insert(roles).values(role);
};

export const deleteRoleById = async (roleId: number) => {
    return await db.delete(roles).where(eq(roles.id, roleId));
};

export type GetRoles_C_Tag = `getRoles_C`;
export const getRoles = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return await db.query.roles.findMany({
        where: (table, { like }) => like(table.name, `%${search}%`),
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export const getRolesTotalRow = async (search: string = "") => {
    const totalRows = await db
        .select({ count: count() })
        .from(roles)
        .where(like(roles.name, `%${search}%`));
    return totalRows[0].count;
};

export const getRoleByIdNoFilter = async (roleId: number) => {
    return await db.query.roles.findFirst({
        columns: {
            name: true,
            id: true,
        },
        with: {
            rolePermissions: {
                columns: {},
                with: {
                    permission: {
                        columns: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        where: (table, { eq }) => eq(table.id, roleId),
    });
};

export const getRoleById = async (roleId: number, userType: UserType) => {
    const role = await getRoleByIdNoFilter(roleId);

    if (userType === UserType.SUPER_ADMIN) {
        return role;
    }

    const rolePermissions = role?.rolePermissions.filter(
        (rp) => !PermissionsToFilterIfNotSuperAdmin.includes(rp.permission.id),
    );

    return {
        ...role,
        rolePermissions: rolePermissions || [],
    };
};

const usersInRoleSubQuery = (roleId: number) => {
    return db
        .selectDistinct({
            // doesn't matter what we select, at least select 1 column
            userId: userRoles.userId,
        })
        .from(userRoles)
        .where(
            and(eq(userRoles.roleId, roleId), eq(users.id, userRoles.userId)),
        );
};

export const getUsersInRole = async (roleId: number) => {
    return await db.query.users.findMany({
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileUrl: true,
            hasLinkedGithub: true,
        },
        where: (table, { exists, and }) =>
            and(
                exists(usersInRoleSubQuery(roleId)),
                eq(table.type, UserType.USER),
            ),
    });
};

export const getUsersNotInRole = async (
    roleId: number,
    search: string = "",
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    return await db.query.users.findMany({
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileUrl: true,
            hasLinkedGithub: true,
        },
        where: (table, { notExists, and, eq, or }) =>
            and(
                notExists(usersInRoleSubQuery(roleId)),
                or(
                    like(table.firstName, `%${search}%`),
                    like(table.lastName, `%${search}%`),
                ),
                eq(table.type, UserType.USER),
            ),
    });
};

export const editRoleById = async (
    roleId: number,
    usersToAdd: string[],
    usersToRemove: string[],
    permissionsToAdd: number[],
    permissionsToRemove: number[],
    roleName?: string,
) => {
    await db.transaction(async (tx) => {
        // Update role name
        if (roleName) {
            await tx
                .update(roles)
                .set({ name: roleName })
                .where(eq(roles.id, roleId));
        }

        // Add users to role
        if (Array.isArray(usersToAdd) && usersToAdd.length > 0) {
            const tempUsers = await tx.query.users.findMany({
                where: inArray(users.id, usersToAdd),
            });

            if (!tempUsers.some((user) => user.type === UserType.USER)) {
                throw new Error("Only users type user can be added to role");
            }

            await tx.insert(userRoles).values(
                usersToAdd.map((userId) => ({
                    userId,
                    roleId,
                })),
            );
        }

        // Remove users from role
        if (Array.isArray(usersToRemove) && usersToRemove.length > 0) {
            await tx
                .delete(userRoles)
                .where(
                    and(
                        eq(userRoles.roleId, roleId),
                        inArray(userRoles.userId, usersToRemove),
                    ),
                );
        }

        // Add permissions to role
        if (Array.isArray(permissionsToAdd) && permissionsToAdd.length > 0) {
            await tx.insert(rolePermissions).values(
                permissionsToAdd.map((permissionId) => ({
                    roleId,
                    permissionId,
                })),
            );
        }

        // Remove permissions from role
        if (
            Array.isArray(permissionsToRemove) &&
            permissionsToRemove.length > 0
        ) {
            await tx
                .delete(rolePermissions)
                .where(
                    and(
                        eq(rolePermissions.roleId, roleId),
                        inArray(
                            rolePermissions.permissionId,
                            permissionsToRemove,
                        ),
                    ),
                );
        }
    });
};
