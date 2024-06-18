"use server";

import { returnFetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { FetchCreateApplicationForm } from "../api/join-us/apply/route";
import { getBaseUrl } from "@/lib/server_utils";

export async function fetchCreateApplicationForm(
    formData: FormData,
): ResponseJson<FetchCreateApplicationForm> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/join-us/apply`,
            {
                method: "POST",
                body: formData,
            },
        );

        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}
