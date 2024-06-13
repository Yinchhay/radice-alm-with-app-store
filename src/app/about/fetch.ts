"use server";

import { ResponseJson, fetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl } from "@/lib/server_utils";
import { FetchPublicMemberData } from "../api/public/members/route";

export type getMembersReturnType = Awaited<ReturnType<typeof getMembers>>;

export async function getMembers(): ResponseJson<FetchPublicMemberData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/members`,
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
