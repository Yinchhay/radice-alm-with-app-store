import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getCategoriesBySearch } from "@/repositories/category";
import { NextRequest } from "next/server";

type GetCategoriesBySearchReturnType = Awaited<ReturnType<typeof getCategoriesBySearch>>;

export type FetchCategoriesBySearchData = {
    categories: GetCategoriesBySearchReturnType;
};

const successMessage = "Get categories by search successfully";
const unsuccessMessage = "Get categories by search failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, new Set([]));
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const search = request.nextUrl.searchParams.get("search") || "";
        const rowsPerPage =
            Number(request.nextUrl.searchParams.get("rowsPerPage")) || ROWS_PER_PAGE;

        const categories = await getCategoriesBySearch(search, rowsPerPage);

        return buildSuccessResponse<FetchCategoriesBySearchData>(successMessage, {
            categories: categories,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
