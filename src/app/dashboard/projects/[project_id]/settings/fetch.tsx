import { editProjectSettingsDetail } from "@/app/api/internal/project/[project_id]/schema";
import { FetchEditProjectSettingsDetail } from "@/app/api/internal/project/[project_id]/settings/detail/route";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import { GetCategories_C_Tag } from "@/repositories/category";
import { GetProjects_C_Tag, OneAssociatedProject_C_Tag } from "@/repositories/project";
import { z } from "zod";

export async function fetchEditProjectSettingsDetail(
    body: Omit<z.infer<typeof editProjectSettingsDetail>, "userId">,
    logo?: File,
): ResponseJson<FetchEditProjectSettingsDetail> {
    try {
        const formData = new FormData();
        if (logo) {
            formData.append("projectLogo", logo);
        }
        formData.append("projectName", body.projectName);
        formData.append("projectDescription", body.projectDescription ?? "");
        formData.append(
            "projectCategories",
            JSON.stringify(body.projectCategories),
        );

        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${body.projectId}/settings/detail`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: formData,
            },
        );

        await revalidateTags<OneAssociatedProject_C_Tag | GetProjects_C_Tag>(
            "OneAssociatedProject_C_Tag",
            "getProjects_C_Tag"
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}