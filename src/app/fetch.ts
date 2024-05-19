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
                where: (table, { eq }) => eq(table.categoryId, categoryId),
            },
            // projectMembers: true,
            // projectPartners: true,
        },
        where: (table, { eq }) => eq(table.isPublic, false),
    });
}
