import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPartnersBySearch } from "@/repositories/partner";
import { NextRequest } from "next/server";

type GetPartnersBySearchReturnType = Awaited<
    ReturnType<typeof getPartnersBySearch>
>;

export type FetchPartnersBySearchData = {
    partners: GetPartnersBySearchReturnType;
};

const successMessage = "Get partners by search successfully";
const unsuccessMessage = "Get partners by search failed";

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
            Number(request.nextUrl.searchParams.get("rowsPerPage")) ||
            ROWS_PER_PAGE;

        const partners = await getPartnersBySearch(search, rowsPerPage);

        return buildSuccessResponse<FetchPartnersBySearchData>(successMessage, {
            partners: partners,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
