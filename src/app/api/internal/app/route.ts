import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import {
    getAppsForManageAllApps,
    getAppsForManageAllAppsTotalRow,
} from "@/repositories/app";
import { NextRequest } from "next/server";

export type GetAppsForManageAllAppsReturnType = Awaited<
    ReturnType<typeof getAppsForManageAllApps>
>;

export type FetchAppsForManageAllAppsData = {
    apps: GetAppsForManageAllAppsReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
};

const successMessage = "Get app for manage all apps successfully";
const unsuccessMessage = "Get app for manage all apps failed";

export async function GET(request: NextRequest) {
    try {
        // const { errorNoBearerToken, errorNoPermission } =
        //     await checkBearerAndPermission(
        //         request,
        //         RouteRequiredPermissions.get("manageAllProjects")!,
        //     );
        // if (errorNoBearerToken) {
        //     return buildNoBearerTokenErrorResponse();
        // }
        // if (errorNoPermission) {
        //     return buildNoPermissionErrorResponse();
        // }

        const page: number =
            Number(request.nextUrl.searchParams.get("page")) || 1;
        let rowsPerPage: number =
            Number(request.nextUrl.searchParams.get("rowsPerPage")) ||
            ROWS_PER_PAGE;
        const search = request.nextUrl.searchParams.get("search") || "";

        // limit to max 100 rows per page
        if (rowsPerPage > 100) {
            rowsPerPage = 100;
        }

        const appForManageAllApps =
            await getAppsForManageAllApps(page, rowsPerPage, search);
        const totalRows = await getAppsForManageAllAppsTotalRow(search);

        return buildSuccessResponse<FetchAppsForManageAllAppsData>(
            successMessage,
            {
                apps: appForManageAllApps,  
                totalRows: totalRows,
                rowsPerPage: rowsPerPage,
                page: page,
                maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
