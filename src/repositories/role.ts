import { db } from "@/drizzle/db";
import { permissions, roles, userRoles, users } from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { count, eq, ne, notInArray, sql } from "drizzle-orm";

export const createRole = async (role: typeof roles.$inferInsert) => {
    return await db.insert(roles).values(role);
};

export const deleteRoleById = async (roleId: number) => {
    return await db.delete(roles).where(eq(roles.id, roleId));
};

export const editRoleById = async (
    roleId: number,
    role: typeof roles.$inferInsert,
) => {
    return await db
        .update(roles)
        .set({
            name: role.name,
        })
        .where(eq(roles.id, roleId));
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
    if (roleId == 8) {
        return "You cannot view this role.";
    }

    return await db.transaction(async (transaction) => {
        await transaction.query.userRoles.findMany({
            with: {
                user: {
                    columns: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            where: eq(userRoles.roleId, roleId),
        });
        return await db.transaction(async (transaction) => {
            await transaction.query.permissions.findMany({
                columns: {
                    id: true,
                    name: true,
                },
            });
            return await transaction.query.roles.findFirst({
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
        });
    });
};

export const getUnlistedUsersByRole = async (roleId: number) => {
    if (roleId == 8) {
        return "You cannot view this role.";
    }

    const usersWithRole = await db.query.userRoles.findMany({
        where: eq(userRoles.roleId, roleId),
        columns: {
            userId: true
        }
    });

    const userIdsWithRole = usersWithRole.map(userRole => userRole.userId);

    return await db.query.users.findMany({
        columns: {
            firstName: true,
            lastName: true,
            email: true,
        },
        where: notInArray(users.id, userIdsWithRole)
    });
};