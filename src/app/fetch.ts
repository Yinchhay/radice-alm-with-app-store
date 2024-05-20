"use server";
import { db } from "@/drizzle/db";
import { categories, projectCategories, projects } from "@/drizzle/schema";
import { eq, sql, or, inArray, count, and } from "drizzle-orm";

export async function getCategories() {
    const categories = await db.query.categories.findMany();
    return categories;
}

export type getProjectsByCategoryReturnType = Awaited<
    ReturnType<typeof getProjectsByCategory>
>;
export async function getProjectsByCategory(categoryId: number) {
    return await db.query.projects.findMany({
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
            // projectMembers: true,
            // projectPartners: true,
        },
        where: (table, { eq, exists, and }) =>
            and(
                eq(table.isPublic, false),
                exists(
                    db
                        .select()
                        .from(projectCategories)
                        .where(
                            and(
                                eq(projectCategories.categoryId, categoryId),
                                eq(projectCategories.projectId, table.id),
                            ),
                        ),
                ),
            ),
    });
}
