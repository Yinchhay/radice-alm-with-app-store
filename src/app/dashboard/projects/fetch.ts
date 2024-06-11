'use server'
import { FetchAssociatedProjectsData } from "@/app/api/internal/project/associate/route";
import { FetchCreateProject } from "@/app/api/internal/project/create/route";
import { createProjectFormSchema } from "@/app/api/internal/project/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import {
    getBaseUrl,
    getSessionCookie,
} from "@/lib/server_utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type CreateProjectBody = Omit<
    z.infer<typeof createProjectFormSchema>,
    "userId"
>;

export async function fetchCreateProject(
    body: CreateProjectBody,
    pathname: string,
): ResponseJson<FetchCreateProject> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/create`,
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

export async function fetchAssociatedProjects(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
): ResponseJson<FetchAssociatedProjectsData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/associate?page=${page}&rowsPerPage=${rowsPerPage}&search=${search}`,
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
