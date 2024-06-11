import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUsersBySearch } from "@/repositories/users";
import { NextRequest } from "next/server";

type GetUsersBySearchReturnType = Awaited<ReturnType<typeof getUsersBySearch>>;

export type FetchUsersBySearchData = {
    users: GetUsersBySearchReturnType;
};

const successMessage = "Get users by search successfully";
const unsuccessMessage = "Get users by search failed";

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

        const users = await getUsersBySearch(search, rowsPerPage);

        return buildSuccessResponse<FetchUsersBySearchData>(successMessage, {
            users: users,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
