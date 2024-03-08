import { db } from "@/drizzle/db";
import {
    permissions,
    rolePermissions,
    roles,
    userRoles,
    users,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

/**
 * cache by next js is different from cache by react.
 * next js cache is a server side cache, even when the page is refreshed
 * the cache will still be there, unless the cache is invalidated by the user.
 * on the other hand, react cache is a client side cache, when the page is refreshed
 * the cache will be invalidated.
 * Note: cache will memoized the arguments, so if the arguments are the same,
 * the cache will return the same value
 */
export const getUserById_C = cache(
    async (userId: string) => {
        return (
            (await db.query.users.findFirst({
                where: (user, { eq }) => eq(user.id, userId),
            })) || null
        );
    },
    ["getUserById_C"],
    {
        tags: ["getUserById_C"],
    },
);

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
    return await db.insert(users).values(user);
};

export const getUserRolesAndRolePermissions_C = cache(
    async (userId: string) => {
        return await db.query.userRoles.findMany({
            where: (userRole, { eq }) => eq(userRole.userId, userId),
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
        });
    },
    ["getUserRolesAndRolePermissions_C"],
    {
        tags: ["getUserRolesAndRolePermissions_C"],
    },
);
