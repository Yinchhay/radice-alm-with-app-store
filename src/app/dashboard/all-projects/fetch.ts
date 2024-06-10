"use server";

import { FetchProjectsForManageAllProjectsData } from "@/app/api/internal/project/route";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
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
        return fetchErrorSomethingWentWrong;
    }
}
