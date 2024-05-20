"use server";

import { db } from "@/drizzle/db";
import { UserType } from "@/types/user";

export type getMembersReturnType = Awaited<ReturnType<typeof getMembers>>;

export const getMembers = async () => {
    return await db.query.users.findMany({
        where: (table, { and, eq }) => and(eq(table.type, UserType.USER)),
    });
};
