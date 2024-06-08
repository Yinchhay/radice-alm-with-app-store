import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import {
    getApplicationForms,
    getApplicationFormsTotalRow,
} from "@/repositories/application_forms";
import { NextRequest } from "next/server";

export type GetApplicationFormsReturnType = Awaited<
    ReturnType<typeof getApplicationForms>
>;

export type FetchApplicationFormsData = {
    applicationForms: GetApplicationFormsReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
};

const successMessage = "Get application forms successfully";
const unsuccessMessage = "Get application forms failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                RouteRequiredPermissions.get("manageApplicationForms")!,
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

        // limit to max 100 rows per page
        if (rowsPerPage > 100) {
            rowsPerPage = 100;
        }

        const applicationForms = await getApplicationForms(page, rowsPerPage);
        const totalRows = await getApplicationFormsTotalRow();

        return buildSuccessResponse<FetchApplicationFormsData>(successMessage, {
            applicationForms: applicationForms,
            totalRows: totalRows,
            rowsPerPage: rowsPerPage,
            page: page,
            maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
