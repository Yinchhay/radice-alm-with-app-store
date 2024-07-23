"use server";

import { ResponseJson, returnFetchErrorSomethingWentWrong } from "@/lib/response";
import { FetchMediasData } from "../api/internal/media/route";
import { getBaseUrl } from "@/lib/server_utils";

export async function getMedia(): ResponseJson<FetchMediasData> {
    try {
        const response = await fetch(`${await getBaseUrl()}/api/public/media`, {
            method: "GET",
            cache: "no-cache",
        });
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}
