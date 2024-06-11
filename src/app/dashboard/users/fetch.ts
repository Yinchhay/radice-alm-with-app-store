// add 'use server' on top of the file if u want to make api request on the server
// instead of client side.
// Note: adding 'use server' require proper testing to ensure nothing break
"use server";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { FetchUsersData } from "@/app/api/internal/users/route";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { FetchDeleteUser } from "@/app/api/internal/users/[user_id]/delete/route";
import { z } from "zod";
import { createUserFormSchema } from "@/app/api/internal/users/schema";
import { FetchCreateUser } from "@/app/api/internal/users/create/route";
import { revalidatePath } from "next/cache";

export async function fetchUsers(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
): ResponseJson<FetchUsersData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/users?page=${page}&rowsPerPage=${rowsPerPage}&search=${search}`,
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

export async function fetchCreateUser(
    body: Omit<z.infer<typeof createUserFormSchema>, "password">,
    pathname: string,
): ResponseJson<FetchCreateUser> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/users/create`,
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

export async function fetchDeleteUserById(
    userId: string,
    pathname: string,
): ResponseJson<FetchDeleteUser> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/users/${userId}/delete`,
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

export async function fetchAllUsers(): ResponseJson<FetchUsersData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/users/all`,
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
