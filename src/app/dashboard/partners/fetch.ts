"use server"
import { FetchDeletePartner } from "@/app/api/internal/partner/[partner_id]/delete/route";
import { FetchCreatePartner } from "@/app/api/internal/partner/create/route";
import { FetchPartnersData } from "@/app/api/internal/partner/route";
import { createPartnerFormSchema } from "@/app/api/internal/partner/schema";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function fetchPartners(): ResponseJson<FetchPartnersData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/partner`,
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

export async function fetchCreatePartner(
    body: Omit<z.infer<typeof createPartnerFormSchema>, "password">,
    pathname: string,
): ResponseJson<FetchCreatePartner> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/partner/create`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchDeletePartnerById(
    partnerId: string,
    pathname: string,
): ResponseJson<FetchDeletePartner> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/partner/${partnerId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
