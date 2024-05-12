import { FetchAssociatedProjectsData } from "@/app/api/internal/project/associate/route";
import { FetchCreateProject } from "@/app/api/internal/project/create/route";
import { createProjectFormSchema } from "@/app/api/internal/project/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import { GetProjects_C_Tag } from "@/repositories/project";
import { z } from "zod";

type CreateProjectBody = Omit<
    z.infer<typeof createProjectFormSchema>,
    "userId"
>;

export async function fetchCreateProject(
    body: CreateProjectBody,
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
        await revalidateTags<GetProjects_C_Tag>("getProjects_C_Tag");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchAssociatedProjects(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
): ResponseJson<FetchAssociatedProjectsData> {
    try {
        const sessionId = await getSessionCookie();
        // type casting to ensure that the tags are correct, if there is a typo, it will show an error
        const cacheTag: GetProjects_C_Tag = "getProjects_C_Tag";
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/associate?page=${page}&rowsPerPage=${rowsPerPage}`,
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
