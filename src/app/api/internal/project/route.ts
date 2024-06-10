import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import {
    getProjectsForManageAllProjects,
    getProjectsForManageAllProjectsTotalRow,
} from "@/repositories/project";
import { NextRequest } from "next/server";

export type GetProjectsForManageAllProjectsReturnType = Awaited<
    ReturnType<typeof getProjectsForManageAllProjects>
>;

export type FetchProjectsForManageAllProjectsData = {
    projects: GetProjectsForManageAllProjectsReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
};

const successMessage = "Get project for manage all projects successfully";
const unsuccessMessage = "Get project for manage all projects failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                RouteRequiredPermissions.get("manageAllProjects")!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

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

        const projectForManageAllProjects =
            await getProjectsForManageAllProjects(page, rowsPerPage, search);
        const totalRows = await getProjectsForManageAllProjectsTotalRow();

        return buildSuccessResponse<FetchProjectsForManageAllProjectsData>(
            successMessage,
            {
                projects: projectForManageAllProjects,
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
