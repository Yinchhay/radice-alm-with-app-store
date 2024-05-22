"use server";
import {
    editProjectSettingsDetail,
    editProjectSettingsFiles,
    editProjectSettingsMembers,
    editProjectSettingsPartners,
} from "@/app/api/internal/project/[project_id]/schema";
import { FetchEditProjectSettingsDetail } from "@/app/api/internal/project/[project_id]/settings/update-detail/route";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { z } from "zod";
import { FetchEditProjectSettingsMembers } from "@/app/api/internal/project/[project_id]/settings/update-members/route";
import { FetchEditProjectSettingsPartners } from "@/app/api/internal/project/[project_id]/settings/update-partners/route";
import { FetchEditProjectSettingsFiles } from "@/app/api/internal/project/[project_id]/settings/update-files/route";
import { revalidatePath } from "next/cache";

export async function fetchEditProjectSettingsDetail(
    projectId: number,
    body: Omit<z.infer<typeof editProjectSettingsDetail>, "userId">,
    pathname: string,
    formData: FormData,
): ResponseJson<FetchEditProjectSettingsDetail> {
    try {
        // by default, projectLogo is already in the formData if it exists
        console.log("formData", formData.get("projectLogo"));
        const logo = formData.get("projectLogo");
        if (logo instanceof File && logo.size === 0) {
            formData.delete("projectLogo");
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

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchEditProjectSettingsMembers(
    projectId: number,
    membersData: z.infer<typeof editProjectSettingsMembers>,
    pathname: string,
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

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchEditProjectSettingsPartners(
    projectId: number,
    partnersData: z.infer<typeof editProjectSettingsPartners>,
    pathname: string,
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

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchEditProjectSettingsFiles(
    projectId: number,
    formData: FormData,
    pathname: string,
): ResponseJson<FetchEditProjectSettingsFiles> {
    try {
        // assuming formData is appended
        // it requires: 
        // - fileToRemove: formData.getAll("fileToRemove") as string[]
        // - fileToUpload: formData.getAll("fileToUpload") as File[]

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

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
