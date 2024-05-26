import { db } from "@/drizzle/db";
import { sessions, users } from "@/drizzle/schema";
import { unstable_cache as cache } from "next/cache";
import { eq, count, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { UserType } from "@/types/user";

/**
 * cache by next js is different from cache by react.
 * next js cache is a server side cache, even when the page is refreshed
 * the cache will still be there, unless the cache is invalidated by the user.
 * on the other hand, react cache is a client side cache, when the page is refreshed
 * the cache will be invalidated.
 * Note: cache will memoized the arguments, so if the arguments are the same,
 * the cache will return the same value
 */
export type GetUserById_C_Tag = `getUserById_C:${string}`;
export const getUserById_C = async (userId: string) => {
    // dynamically cache user by their userId
    return await cache(
        async (userId: string) => {
            return (
                (await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, userId),
                })) || null
            );
        },
        [],
        {
            tags: [`getUserById_C:${userId}`],
        },
    )(userId);
};

/**
 * not everywhere is required to use cache, for example this function
 * is used in the login page, and we don't want to cache the user
 */
export const getUserByEmail = async (email: string) => {
    return await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.email, email),
    });
};

export const createUser = async (user: typeof users.$inferInsert) => {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
    };
    return await db.insert(users).values(userWithHashedPassword);
};

export type GetUserRolesAndRolePermissions_C_Tag =
    | `getUserRolesAndRolePermissions_C:${string}`
    | `getUserRolesAndRolePermissions_C`;
export const getUserRolesAndRolePermissions_C = async (userId: string) => {
    return await cache(
        async (userId: string) => {
            return await db.query.users.findFirst({
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
        await transaction.delete(sessions).where(eq(sessions.userId, userId));
        return await transaction.delete(users).where(eq(users.id, userId));
    });
};

export type GetUsers_C_Tag = `getUsers_C`;

export const getAllUsers = async () => {
    return await db.query.users.findMany({
        where: (table, { eq }) => eq(table.type, UserType.USER),
    });
};

export const getAllUsersExceptThisUser = async (userId: string) => {
    return await db.query.users.findMany({
        where: (table, { and, eq, not }) =>
            and(eq(table.type, UserType.USER), not(eq(table.id, userId)), eq(table.hasLinkedGithub, 
            // TODO: on production, this should be true 
            false)),
    });
}

export const getAllPartnersExceptThisUser = async (userId: string) => {
    return await db.query.users.findMany({
        where: (table, { and, eq, not }) =>
            and(eq(table.type, UserType.PARTNER), not(eq(table.id, userId))),
    });
}

export const getUsers = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    return await db.query.users.findMany({
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export const getUsersTotalRow = async () => {
    const totalRows = await db.select({ count: count() }).from(users);
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
