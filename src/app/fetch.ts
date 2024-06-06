"use server";
import { ResponseJson, fetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl } from "@/lib/server_utils";
import { FetchPublicCategoriesData } from "./api/public/categories/route";
import { FetchPublicProjectsByCategoryIdData } from "./api/public/categories/[category_id]/projects/route";
import { CategoryAndProjects } from "@/repositories/project";
import { FetchPublicProjectsCategoriesData } from "./api/public/categories/projects/route";

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

export async function fetchPublicProjectsByCategory(
    categoryId: number,
): ResponseJson<FetchPublicProjectsByCategoryIdData> {
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

export async function fetchPublicProjectsAndCategories(): ResponseJson<FetchPublicProjectsCategoriesData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/categories/projects`,
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
