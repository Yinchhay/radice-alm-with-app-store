"use server"
import { FetchApplicationFormsData } from "@/app/api/internal/application-forms/route";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { returnFetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { revalidatePath } from "next/cache";

export async function fetchApplicationForms(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
): ResponseJson<FetchApplicationFormsData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/application-forms?page=${page}&rowsPerPage=${rowsPerPage}&search=${search}`,
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

export async function fetchRejectApplicationFormById(
    applicationFormId: number,
    reason: string,
    pathname: string,
): ResponseJson<FetchApplicationFormsData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/application-forms/${applicationFormId}/reject`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify({ reason }),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}

export async function fetchApproveApplicationFormById(
    applicationFormId: number,
    pathname: string,
): ResponseJson<FetchApplicationFormsData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/application-forms/${applicationFormId}/approve`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}
