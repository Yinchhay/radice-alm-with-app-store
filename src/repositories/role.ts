import { db } from "@/drizzle/db";
import { roles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const createRole = async (
    role: typeof roles.$inferInsert,
) => {
    return db.insert(roles).values(role);
};

export const deleteRoleById = async (roleId: number) => {
    return db.delete(roles).where(eq(roles.id, roleId));
};

export const getRoles_C = cache(
    async () => {
        return db.query.roles.findMany();
    },
    ["getRoles_C"],
    {
        tags: ["getRoles_C"],
    },
);
