"use server";
import { FetchPublicProjectByIdData } from "@/app/api/public/projects/[project_id]/route";
import { ResponseJson, returnFetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl } from "@/lib/server_utils";

export async function getProjectByIdForPublic(
    project_id: number,
): ResponseJson<FetchPublicProjectByIdData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/projects/${project_id}`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}
