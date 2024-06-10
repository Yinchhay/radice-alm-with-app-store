"use server";
import { FetchEditProjectContent } from "@/app/api/internal/project/[project_id]/edit/route";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import { ResponseJson, fetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { Chapter } from "@/types/content";

export async function fetchOneAssociatedProject(
    projectId: string,
): ResponseJson<FetchOneAssociatedProjectData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
export async function fetchEditProjectContentById(
    projectId: string,
    chapters: Chapter[],
): ResponseJson<FetchEditProjectContent> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/edit`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(chapters),
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
