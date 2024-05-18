import { FetchDeletePartner } from "@/app/api/internal/partner/[partner_id]/delete/route";
import { FetchCreatePartner } from "@/app/api/internal/partner/create/route";
import { FetchPartnersData } from "@/app/api/internal/partner/route";
import { createPartnerFormSchema } from "@/app/api/internal/partner/schema";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import { GetPartners_C_Tag } from "@/repositories/partner";
import { z } from "zod";

export async function fetchPartners(): ResponseJson<FetchPartnersData> {
    try {
        const sessionId = await getSessionCookie();
        // even tho we don't cache, we tag it anyway incase we want to cache or we want to update ui without having to refresh the page
        const cacheTag: GetPartners_C_Tag = "getPartners_C";
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/partner`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                next: {
                    tags: [cacheTag],
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
        await revalidateTags<GetPartners_C_Tag>("getPartners_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchDeletePartnerById(
    partnerId: string,
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
        await revalidateTags<GetPartners_C_Tag>("getPartners_C");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
