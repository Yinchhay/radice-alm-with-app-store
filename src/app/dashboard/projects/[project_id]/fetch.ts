"use server";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import { FetchPublicProjectByIdData } from "@/app/api/public/projects/[project_id]/route";
import { ResponseJson, returnFetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";

export async function getOneAssociatedProjectData(
    project_id: number,
): ResponseJson<FetchOneAssociatedProjectData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${project_id}`,
            {
                method: "GET",
                cache: "no-cache",
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
