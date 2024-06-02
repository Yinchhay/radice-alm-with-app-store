"use server";
import { db } from "@/drizzle/db";
import { categories, projectCategories, projects } from "@/drizzle/schema";
import { ResponseJson, fetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { eq, sql, or, inArray, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { FetchPublicCategoriesData } from "./api/public/categories/route";

// export async function getCategories() {
//     const categories = await db.query.categories.findMany();
//     return categories;
// }

export async function fetchPublicCategories(): ResponseJson<FetchPublicCategoriesData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/public/categories`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
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
                eq(table.isPublic, true),
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
