// add 'use server' on top of the file if u want to make api request on the server
// instead of client side.
// Note: adding 'use server' require proper testing to ensure nothing break
"use server";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { FetchRolesData } from "@/app/api/internal/role/route";
import { FetchRoleData } from "@/app/api/internal/role/[role_id]/route";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import { GetRoles_C_Tag } from "@/repositories/role";
import { GetUserRolesAndRolePermissions_C_Tag } from "@/repositories/users";
import { FetchDeleteRole } from "@/app/api/internal/role/[role_id]/delete/route";
import { z } from "zod";
import {
    createRoleFormSchema,
    editRoleByIdSchema,
    addUserToRoleFormSchema,
} from "@/app/api/internal/role/schema";
import { FetchCreateRole } from "@/app/api/internal/role/create/route";
import { FetchEditRole } from "@/app/api/internal/role/[role_id]/edit/route";
import { FetchUsersInRole } from "@/app/api/internal/role/[role_id]/users/route";
import { FetchUsersNotInRole } from "@/app/api/internal/role/[role_id]/users-not-in-role/route";
import { ROWS_PER_PAGE } from "@/lib/pagination";

export async function fetchRoles(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
): ResponseJson<FetchRolesData> {
    try {
        const sessionId = await getSessionCookie();
        // type casting to ensure that the tags are correct, if there is a typo, it will show an error
        const cacheTag: GetRoles_C_Tag = "getRoles_C";
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role?page=${page}&rowsPerPage=${rowsPerPage}`,
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

export async function fetchRoleById(
    roleId: number,
): ResponseJson<FetchRoleData> {
    try {
        const sessionId = await getSessionCookie();
        const cacheTag: GetRoles_C_Tag = "getRoles_C";
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role/${roleId}`,
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

export async function fetchCreateRole(
    body: z.infer<typeof createRoleFormSchema>,
): ResponseJson<FetchCreateRole> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role/create`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );
        await revalidateTags<GetRoles_C_Tag>("getRoles_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchDeleteRoleById(
    roleId: number,
): ResponseJson<FetchDeleteRole> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role/${roleId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );
        await revalidateTags<GetRoles_C_Tag>("getRoles_C");
        await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>("getUserRolesAndRolePermissions_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchUsersInRole(
    roleId: number,
): ResponseJson<FetchUsersInRole> {
    try {
        const sessionId = await getSessionCookie();
        // type casting to ensure that the tags are correct, if there is a typo, it will show an error
        const cacheTag: GetRoles_C_Tag = "getRoles_C";
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role/${roleId}/users`,
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

export async function fetchUsersNotInRole(
    roleId: number,
): ResponseJson<FetchUsersNotInRole> {
    try {
        const sessionId = await getSessionCookie();
        // type casting to ensure that the tags are correct, if there is a typo, it will show an error
        const cacheTag: GetRoles_C_Tag = "getRoles_C";
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role/${roleId}/users-not-in-role`,
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

export async function fetchEditRoleById(
    body: z.infer<typeof editRoleByIdSchema>,
): ResponseJson<FetchEditRole> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role/${body.roleId}/edit`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );
        await revalidateTags<GetRoles_C_Tag>("getRoles_C");
        await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>("getUserRolesAndRolePermissions_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchAddUserToRole(
    body: z.infer<typeof addUserToRoleFormSchema>,
): ResponseJson<FetchRoleData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/role/user/add`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );
        await revalidateTags<GetRoles_C_Tag>("getRoles_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
