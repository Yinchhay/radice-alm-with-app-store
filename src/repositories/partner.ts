import { db } from "@/drizzle/db";
import { sessions, users } from "@/drizzle/schema";
import { UserType } from "@/types/user";
import bcrypt from "bcrypt";
import { and, eq, like, sql } from "drizzle-orm";

export const createPartner = async (user: typeof users.$inferInsert) => {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    return await db.insert(users).values({
        ...user,
        type: UserType.PARTNER,
        password: hashedPassword,
    });
};

export type GetPartners_C_Tag = `getPartners_C`;
export const getPartners = async (search: string = "") => {
    return await db.query.users.findMany({
        columns: {
            password: false,
        },
        where: (table) =>
            and(
                eq(table.type, UserType.PARTNER),
                like(table.email, `%${search}%`),
            ),
        orderBy: sql`id DESC`,
    });
};

export const deletePartnerById = async (partnerId: string) => {
    return await db.transaction(async (tx) => {
        return tx
            .delete(users)
            .where(
                and(eq(users.type, UserType.PARTNER), eq(users.id, partnerId)),
            );
    });
};
