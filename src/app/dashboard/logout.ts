import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { FetchLogoutUser } from "@/app/api/internal/logout/route";

export async function UserLogout(): ResponseJson<FetchLogoutUser> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/logout`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
