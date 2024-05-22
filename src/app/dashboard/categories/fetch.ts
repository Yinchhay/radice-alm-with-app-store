"use server";
// add 'use server' on top of the file if u want to make api request on the server
// instead of client side.
// Note: adding 'use server' require proper testing to ensure nothing break
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { FetchCategoriesData } from "@/app/api/internal/category/route";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { FetchDeleteCategory } from "@/app/api/internal/category/[category_id]/delete/route";
import { z } from "zod";
import {
    createCategoryFormSchema,
    editCategoryFormSchema,
} from "@/app/api/internal/category/schema";
import { FetchCreateCategory } from "@/app/api/internal/category/create/route";
import { FetchEditCategory } from "@/app/api/internal/category/[category_id]/edit/route";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { revalidatePath } from "next/cache";

export async function fetchCategories(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
): ResponseJson<FetchCategoriesData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/category?page=${page}&rowsPerPage=${rowsPerPage}&search=${search}`,
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

export async function fetchCreateCategory(
    body: z.infer<typeof createCategoryFormSchema>,
    pathname: string,
): ResponseJson<FetchCreateCategory> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/category/create`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchDeleteCategoryById(
    categoryId: number,
    pathname: string,
): ResponseJson<FetchDeleteCategory> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/category/${categoryId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchEditCategoryById(
    body: z.infer<typeof editCategoryFormSchema>,
    pathname: string,
): ResponseJson<FetchEditCategory> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/category/${body.categoryId}/edit`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}