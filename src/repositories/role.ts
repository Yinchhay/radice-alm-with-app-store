import { db } from "@/drizzle/db";
import { roles, userRoles, users, rolePermissions } from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { count, eq, sql, and, inArray } from "drizzle-orm";

export const createRole = async (role: typeof roles.$inferInsert) => {
    return await db.insert(roles).values(role);
};

export const deleteRoleById = async (roleId: number) => {
    return await db.transaction(async (trx) => {
        // Delete role_permissions
        const deleteRolePermissionsResult = await trx
            .delete(rolePermissions)
            .where(eq(rolePermissions.roleId, roleId));

        // Delete user_roles
        const deleteUserRolesResult = await trx
            .delete(userRoles)
            .where(eq(userRoles.roleId, roleId));

        // Delete role
        const deleteRoleResult = await trx
            .delete(roles)
            .where(eq(roles.id, roleId));

        return {
            rolePermissionsAffectedRows:
                deleteRolePermissionsResult[0].affectedRows,
            userRolesAffectedRows: deleteUserRolesResult[0].affectedRows,
            rolesAffectedRows: deleteRoleResult[0].affectedRows,
        };
    });
};

export type GetRoles_C_Tag = `getRoles_C`;
export const getRoles = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    return await db.query.roles.findMany({
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export const getRolesTotalRow = async () => {
    const totalRows = await db.select({ count: count() }).from(roles);
    return totalRows[0].count;
};

export const getRoleById = async (roleId: number) => {
    return await db.query.roles.findFirst({
        columns: {
            name: true,
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
        where: eq(roles.id, roleId),
    });
};

export const getUsersInRole = async (roleId: number) => {
    return await db.query.userRoles.findMany({
        columns: {
            id: false,
            userId: false,
            roleId: false,
        },
        with: {
            user: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
        where: eq(userRoles.roleId, roleId),
    });
};

export function filterGetOnlyUserNotInRole(
    usersInARole: Pick<
        typeof users.$inferSelect,
        "id" | "firstName" | "lastName" | "email"
    >[],
    usersInTheSystem: Pick<
        typeof users.$inferSelect,
        "id" | "firstName" | "lastName" | "email"
    >[],
) {
    return usersInTheSystem.filter((user) => {
        return !usersInARole.some((userInRole) => userInRole.id === user.id);
    });
}

export const editRoleById = async (body: {
    name: string;
    users: { id: string; firstName: string; lastName: string }[];
    roleId: number;
    permissions: { id: number; name: string }[];
}) => {
    const { name, users, roleId, permissions } = body;

    await db.transaction(async (trx) => {
        // Update role name
        await trx.update(roles).set({ name }).where(eq(roles.id, roleId));

        // Get current users in the role
        const currentUsersInRole = await trx
            .select({ userId: userRoles.userId })
            .from(userRoles)
            .where(eq(userRoles.roleId, roleId));

        const currentUserIds = currentUsersInRole.map(
            (userRole) => userRole.userId,
        );
        const userIds = users.map((user) => user.id);

        // Filter users to add and remove
        const usersToAdd = userIds.filter(
            (userId) => !currentUserIds.includes(userId),
        );
        const usersToRemove = currentUserIds.filter(
            (userId) => !userIds.includes(userId),
        );

        // Remove users from role
        if (usersToRemove.length > 0) {
            await trx
                .delete(userRoles)
                .where(
                    and(
                        eq(userRoles.roleId, roleId),
                        inArray(userRoles.userId, usersToRemove),
                    ),
                );
        }

        // Add users to role
        if (usersToAdd.length > 0) {
            await trx
                .insert(userRoles)
                .values(usersToAdd.map((userId) => ({ userId, roleId })));
        }

        // Get current role permissions
        const currentRolePermissions = await trx
            .select({ permissionId: rolePermissions.permissionId })
            .from(rolePermissions)
            .where(eq(rolePermissions.roleId, roleId));

        const currentPermissionIds = currentRolePermissions.map(
            (rolePermission) => rolePermission.permissionId,
        );

        // Filter permissions to add and remove
        const permissionsToAdd = permissions
            .filter(
                (permission) => !currentPermissionIds.includes(permission.id),
            )
            .map((permission) => permission.id);

        const permissionsToRemove = currentPermissionIds.filter(
            (permissionId) =>
                !permissions.some(
                    (permission) => permission.id === permissionId,
                ),
        );

        // Remove permissions from role
        if (permissionsToRemove.length > 0) {
            await trx
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

        // Add permissions to role
        if (permissionsToAdd.length > 0) {
            await trx.insert(rolePermissions).values(
                permissionsToAdd.map((permissionId) => ({
                    roleId,
                    permissionId,
                })),
            );
        }
    });
};
