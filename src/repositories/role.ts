import { db } from "@/drizzle/db";
import { roles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const createRole = async (
    role: typeof roles.$inferInsert,
) => {
    return db.insert(roles).values(role);
};

export const deleteRoleById = async (roleId: number) => {
    return db.delete(roles).where(eq(roles.id, roleId));
};

export const editRoleById = async (
    roleId: number,
    role: typeof roles.$inferInsert,
) => {
    return db
        .update(roles)
        .set({
            name: role.name,
        })
        .where(eq(roles.id, roleId));
};

export type GetRoles_C_Tag = `getRoles_C`;
export const getRoles = async () => {
    return db.query.roles.findMany();
};
