import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getRoles, getRolesTotalRow } from "@/repositories/role";
import { NextRequest } from "next/server";

type GetRolesReturnType = Awaited<ReturnType<typeof getRoles>>;

export type FetchRolesData = {
    roles: GetRolesReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
};

const successMessage = "Get roles successfully";
const unsuccessMessage = "Get roles failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                RouteRequiredPermissions.get("manageRoles")!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const page: number =
            Number(request.nextUrl.searchParams.get("page")) || 1;
        const rowsPerPage: number =
            Number(request.nextUrl.searchParams.get("rowsPerPage")) ||
            ROWS_PER_PAGE;
        const search = request.nextUrl.searchParams.get("search") || "";

        const roles = await getRoles(page, rowsPerPage, search);
        const totalRows = await getRolesTotalRow(search);

        return buildSuccessResponse<FetchRolesData>(successMessage, {
            roles: roles,
            totalRows: totalRows,
            rowsPerPage: rowsPerPage,
            maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
