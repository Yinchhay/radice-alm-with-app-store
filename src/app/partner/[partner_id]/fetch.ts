"use server";

import { FetchPublicProjectsByIdData } from "@/app/api/public/partners/[partner_id]/projects/route";
import { FetchPublicPartnerByIdData } from "@/app/api/public/partners/[partner_id]/route";
import { db } from "@/drizzle/db";
import { ResponseJson, fetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl } from "@/lib/server_utils";
import { UserType } from "@/types/user";

// TODO: Missing isPublic
export async function getPublicPartnerById(
    partnerId: string,
): ResponseJson<FetchPublicPartnerByIdData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/partners/${partnerId}`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
export async function getPublicProjectByPartnerId(
    partnerId: string,
): ResponseJson<FetchPublicProjectsByIdData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/partners/${partnerId}/projects`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
