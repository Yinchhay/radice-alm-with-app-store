"use server";

import { db } from "@/drizzle/db";
import { UserType } from "@/types/user";

// TODO: Missing isPublic
export const getPublicMemberById = async (memberId: string) => {
    return await db.query.users.findFirst({
        where: (table, { and, eq }) =>
            and(
                eq(table.type, UserType.USER),
                eq(table.hasLinkedGithub, true),
                eq(table.id, memberId),
            ),
    });
};

// TODO: Set isPublic to true, now is false
export async function getPublicProjectByUserId(userId: string) {
    return await db.query.projects.findMany({
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
            user: true,
        },
        where: (table, { eq, and }) =>
            and(eq(table.isPublic, false), eq(table.userId, userId)),
    });
}
