import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { FetchCategoriesData } from "@/app/api/internal/category/route";
import { getBaseUrl } from "@/lib/server_utils";
import { getSessionCookie } from "@/auth/lucia";
import { GetCategories_C_Tag } from "@/repositories/category";
import { FetchDeleteCategory } from "@/app/api/internal/category/[category_id]/delete/route";
import { FetchEditCategory } from "@/app/api/internal/category/[category_id]/edit/route";
import { z } from "zod";
import { createCategoryFormSchema, editCategoryFormSchema } from "./schema";
import { FetchCreateCategory } from "@/app/api/internal/category/create/route";

export const fetchCategories = async (): ResponseJson<FetchCategoriesData> => {
    try {
        const sessionId = getSessionCookie();
        // type casting to ensure that the tags are correct, if there is a typo, it will show an error
        const cacheTag: GetCategories_C_Tag = "getCategories_C";
        const response = await fetch(`${getBaseUrl()}/api/internal/category`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
            next: {
                tags: [cacheTag],
            },
            cache: "force-cache",
        });
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
};

export const fetchCreateCategory = async (
    body: z.infer<typeof createCategoryFormSchema>,
): ResponseJson<FetchCreateCategory> => {
    try {
        const sessionId = getSessionCookie();
        const response = await fetch(
            `${getBaseUrl()}/api/internal/category/create`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
};

export const fetchDeleteCategoryById = async (
    categoryId: number,
): ResponseJson<FetchDeleteCategory> => {
    try {
        const sessionId = getSessionCookie();
        const response = await fetch(
            `${getBaseUrl()}/api/internal/category/${categoryId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
};

export const fetchEditCategoryById = async (
    body: z.infer<typeof editCategoryFormSchema>,
): ResponseJson<FetchEditCategory> => {
    try {
        const sessionId = getSessionCookie();
        const response = await fetch(
            `${getBaseUrl()}/api/internal/category/${body.categoryId}/edit`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
};
