import { db } from "@/drizzle/db";
import { sessions, users } from "@/drizzle/schema";
import { SALT_ROUNDS } from "@/lib/IAM";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { UserType } from "@/types/user";
import bcrypt from "bcrypt";
import { and, count, eq, like, sql } from "drizzle-orm";

export const createPartner = async (user: typeof users.$inferInsert) => {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    return await db.insert(users).values({
        ...user,
        type: UserType.PARTNER,
        password: hashedPassword,
    });
};

export const getPartnersTotalRow = async (search: string = "") => {
    const totalRows = await db
        .select({ count: count() })
        .from(users)
        .where(
            and(
                eq(users.type, UserType.PARTNER),
                like(users.email, `%${search}%`),
            ),
        );
    return totalRows[0].count;
};

export const getPartners = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return await db.query.users.findMany({
        columns: {
            password: false,
        },
        where: (table) =>
            and(
                eq(table.type, UserType.PARTNER),
                like(table.email, `%${search}%`),
            ),
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
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

export const getPartnerById = async (userId: string) => {
    return await db.query.users.findFirst({
        columns: {
            password: false,
        },
        where: (table, { eq, and }) =>
            and(eq(table.id, userId), eq(table.type, UserType.PARTNER)),
    });
};

export const getPartnersBySearch = async (
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
                eq(table.type, UserType.PARTNER),
                or(
                    like(table.firstName, `%${search}%`),
                    like(table.lastName, `%${search}%`),
                ),
            ),
        limit: rowsPerPage,
    });
};
