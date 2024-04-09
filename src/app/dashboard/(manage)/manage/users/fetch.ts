// add 'use server' on top of the file if u want to make api request on the server
// instead of client side.
// Note: adding 'use server' require proper testing to ensure nothing break
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { FetchUsersData } from "@/app/api/internal/users/route";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import { GetUsers_C_Tag } from "@/repositories/users";
import { FetchDeleteUser } from "@/app/api/internal/users/[user_id]/delete/route";
import { z } from "zod";
import { createUserFormSchema } from "@/app/api/internal/users/schema";
import { FetchCreateUser } from "@/app/api/internal/users/create/route";

export async function fetchUsers(): ResponseJson<FetchUsersData> {
    try {
        const sessionId = await getSessionCookie();
        // type casting to ensure that the tags are correct, if there is a typo, it will show an error
        const cacheTag: GetUsers_C_Tag = "getUsers_C";
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/users`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                next: {
                    tags: [cacheTag],
                },
                cache: "force-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchCreateUser(
    body: z.infer<typeof createUserFormSchema>,
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
        await revalidateTags<GetUsers_C_Tag>("getUsers_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchDeleteUserById(
    userId: string,
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
        await revalidateTags<GetUsers_C_Tag>("getUsers_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
