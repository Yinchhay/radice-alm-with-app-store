"use server";
import {
    editProjectSettingsDetail,
    editProjectSettingsFiles,
    editProjectSettingsMembers,
    editProjectSettingsPartners,
    transferProjectOwnershipSchema,
    updateProjectPublicStatusSchema,
} from "@/app/api/internal/project/[project_id]/schema";
import { FetchEditProjectSettingsDetail } from "@/app/api/internal/project/[project_id]/settings/update-detail/route";
import { returnFetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { z } from "zod";
import { FetchEditProjectSettingsMembers } from "@/app/api/internal/project/[project_id]/settings/update-members/route";
import { FetchEditProjectSettingsPartners } from "@/app/api/internal/project/[project_id]/settings/update-partners/route";
import { FetchEditProjectSettingsFiles } from "@/app/api/internal/project/[project_id]/settings/update-files/route";
import { revalidatePath } from "next/cache";
import { ProjectLink, ProjectPipelineStatus } from "@/drizzle/schema";
import { FetchEditProjectSettingsLinks } from "@/app/api/internal/project/[project_id]/settings/update-links/route";
import { FetchEditProjectSettingsPipelines } from "@/app/api/internal/project/[project_id]/settings/update-pipeline/route";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { FetchUsersBySearchData } from "@/app/api/internal/users/search/route";
import { FetchCategoriesBySearchData } from "@/app/api/internal/category/search/route";
import { FetchPartnersBySearchData } from "@/app/api/internal/partner/search/route";
import { FetchUpdateProjectSettingsPublicStatus } from "@/app/api/internal/project/[project_id]/settings/update-public-status/route";
import { FetchUpdateProjectSettingsAppStatus } from "@/app/api/internal/project/[project_id]/settings/update-app-status/route";

export async function fetchEditProjectSettingsDetail(
    projectId: number,
    body: Omit<z.infer<typeof editProjectSettingsDetail>, "userId">,
    pathname: string,
    formData: FormData,
): ResponseJson<FetchEditProjectSettingsDetail> {
    try {
        // by default, projectLogo is already in the formData if it exists
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
        return returnFetchErrorSomethingWentWrong(error);
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
        return returnFetchErrorSomethingWentWrong(error);
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
        return returnFetchErrorSomethingWentWrong(error);
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
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchEditProjectSettingsLinks(
    projectId: number,
    links: ProjectLink[],
    pathname: string,
): ResponseJson<FetchEditProjectSettingsLinks> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-links`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify({
                    links,
                }),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchEditProjectSettingsPipeline(
    projectId: number,
    pipelines: ProjectPipelineStatus,
    pathname: string,
): ResponseJson<FetchEditProjectSettingsPipelines> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-pipeline`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify({
                    pipelineStatus: pipelines,
                }),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchTransferProjectOwnerShip(
    projectId: number,
    body: z.infer<typeof transferProjectOwnershipSchema>,
    pathname: string,
): ResponseJson<FetchEditProjectSettingsPipelines> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/transfer-ownership`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchUpdateProjectPublicStatus(
    projectId: number,
    body: z.infer<typeof updateProjectPublicStatusSchema>,
    pathname: string,
): ResponseJson<FetchUpdateProjectSettingsPublicStatus> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-public-status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );

        const result = await response.json();
        if (result.success) {
            revalidatePath(pathname);
        }
        return result;
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchUpdateProjectAppStatus(
    projectId: number,
    body: z.infer<typeof updateProjectPublicStatusSchema>,
    pathname: string,
): ResponseJson<FetchUpdateProjectSettingsAppStatus> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/${projectId}/settings/update-app-status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );

        const result = await response.json();
        if (result.success) {
            revalidatePath(pathname);
        }
        return result;
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchUsersBySearch(
    search: string = "",
    rowsPerPage: number = ROWS_PER_PAGE,
): ResponseJson<FetchUsersBySearchData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/users/search?search=${search}&rowsPerPage=${rowsPerPage}`,
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

export async function fetchCategoriesBySearch(
    search: string = "",
    rowsPerPage: number = ROWS_PER_PAGE,
): ResponseJson<FetchCategoriesBySearchData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/category/search?search=${search}&rowsPerPage=${rowsPerPage}`,
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

export async function fetchPartnersBySearch(
    search: string = "",
    rowsPerPage: number = ROWS_PER_PAGE,
): ResponseJson<FetchPartnersBySearchData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/partner/search?search=${search}&rowsPerPage=${rowsPerPage}`,
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
