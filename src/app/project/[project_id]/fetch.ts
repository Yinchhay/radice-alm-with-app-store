"use server";

import { db } from "@/drizzle/db";

//TODO: change isPublic to true, now is false
export async function getProjectByIdForPublic(project_id: number) {
    return await db.query.projects.findFirst({
        where: (table, { eq, and }) =>
            and(eq(table.isPublic, true), eq(table.id, project_id)),
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
            projectMembers: {
                with: {
                    user: true,
                },
            },
            projectPartners: {
                with: {
                    partner: true,
                },
            },
            user: true,
        },
    });
}
