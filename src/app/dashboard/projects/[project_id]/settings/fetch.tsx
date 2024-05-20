import {
    editProjectSettingsDetail,
    editProjectSettingsFiles,
    editProjectSettingsMembers,
    editProjectSettingsPartners,
} from "@/app/api/internal/project/[project_id]/schema";
import { FetchEditProjectSettingsDetail } from "@/app/api/internal/project/[project_id]/settings/update-detail/route";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import {
    GetProjects_C_Tag,
    OneAssociatedProject_C_Tag,
} from "@/repositories/project";
import { z } from "zod";
import { MemberList } from "./project_member";
import { FetchEditProjectSettingsMembers } from "@/app/api/internal/project/[project_id]/settings/update-members/route";
import { FetchEditProjectSettingsPartners } from "@/app/api/internal/project/[project_id]/settings/update-partners/route";
import { FetchEditProjectSettingsFiles } from "@/app/api/internal/project/[project_id]/settings/update-files/route";

export async function fetchEditProjectSettingsDetail(
    projectId: number,
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
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-detail`,
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
            "getProjects_C_Tag",
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchEditProjectSettingsMembers(
    projectId: number,
    membersData: z.infer<typeof editProjectSettingsMembers>,
): ResponseJson<FetchEditProjectSettingsMembers> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-members`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(membersData),
            },
        );

        await revalidateTags<OneAssociatedProject_C_Tag | GetProjects_C_Tag>(
            "OneAssociatedProject_C_Tag",
            "getProjects_C_Tag",
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchEditProjectSettingsPartners(
    projectId: number,
    partnersData: z.infer<typeof editProjectSettingsPartners>,
): ResponseJson<FetchEditProjectSettingsPartners> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-partners`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(partnersData),
            },
        );

        await revalidateTags<OneAssociatedProject_C_Tag | GetProjects_C_Tag>(
            "OneAssociatedProject_C_Tag",
            "getProjects_C_Tag",
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchEditProjectSettingsFiles(
    projectId: number,
    filesData: z.infer<typeof editProjectSettingsFiles>,
): ResponseJson<FetchEditProjectSettingsFiles> {
    try {
        const formData = new FormData();
        if (filesData.fileToUpload) {
            for (const file of filesData.fileToUpload) {
                formData.append("fileToUpload", file);
            }
        }

        if (filesData.fileToRemove) {
            for (const filename of filesData.fileToRemove) {
                formData.append("fileToRemove", filename);
            }
        }

        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-files`,
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
            "getProjects_C_Tag",
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
