import { ResponseJson } from "@/lib/response";
import { FetchCategoriesData } from "@/app/api/internal/category/route";
import { getBaseUrl } from "@/lib/server_utils";
import { getSessionCookie } from "@/auth/lucia";
import { GetCategories_C_Tag } from "@/repositories/category";
import { ErrorMessage } from "@/types/error";

export const fetchCategories = async (): ResponseJson<FetchCategoriesData> => {
    try {
        const sessionId = getSessionCookie();
        // type casting to ensure that the tags are correct, if there is a typo, it will show an error
        const cacheTag: GetCategories_C_Tag = "getCategories_C";
        const response = await fetch(`${getBaseUrl()}/api/internal/category`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
            next: {
                tags: [cacheTag],
            },
            cache: "force-cache",
        });
        return await response.json();
    } catch (error: any) {
        return {
            success: false,
            message: ErrorMessage.SomethingWentWrong,
            errors: {},
        };
    }
};
