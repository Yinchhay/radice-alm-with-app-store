import { returnFetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl } from "@/lib/server_utils";
import { FetchLogoutUser } from "@/app/api/logout/route";

export async function logout(): ResponseJson<FetchLogoutUser> {
    try {
        const response = await fetch(`${await getBaseUrl()}/api/logout`, {
            method: "POST",
            cache: "no-cache",
        });
        return await response.json();
    } catch (error: any) {
        return returnFetchErrorSomethingWentWrong(error);
    }
}
