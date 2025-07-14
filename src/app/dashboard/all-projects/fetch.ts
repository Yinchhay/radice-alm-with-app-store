"use server";

import { FetchProjectsForManageAllProjectsData } from "@/app/api/internal/project/route";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { returnFetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";

export async function fetchProjectsForManageAllProjects(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
): ResponseJson<FetchProjectsForManageAllProjectsData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project?page=${page}&rowsPerPage=${rowsPerPage}&search=${search}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );

        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchUpdateAppPriority(
    projectId: number,
    featuredPriority: boolean,
    pathname: string,
) {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/toggle-is-featured`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify({ featuredPriority }),
            },
        );
        const result = await response.json();
        // Optionally revalidate path if needed
        // if (result.success) revalidatePath(pathname);
        return result;
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}
