"use server";
import { db } from "@/drizzle/db";
import { categories, projectCategories, projects } from "@/drizzle/schema";
import { ResponseJson, fetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { eq, sql, or, inArray, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { FetchPublicCategoriesData } from "./api/public/categories/route";
import { FetchPublicProjectsCategoriesData } from "./api/public/categories/[category_id]/projects/route";

// export async function getCategories() {
//     const categories = await db.query.categories.findMany();
//     return categories;
// }

export async function fetchPublicCategories(): ResponseJson<FetchPublicCategoriesData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/categories`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchPublicProjectsByCategory(categoryId: number): ResponseJson<FetchPublicProjectsCategoriesData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/categories/${categoryId}/projects`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
