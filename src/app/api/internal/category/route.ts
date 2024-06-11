import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getCategories, getCategoriesTotalRow } from "@/repositories/category";
import { NextRequest } from "next/server";

export type GetCategoriesReturnType = Awaited<ReturnType<typeof getCategories>>;

export type FetchCategoriesData = {
    categories: GetCategoriesReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
};

const successMessage = "Get categories successfully";
const unsuccessMessage = "Get categories failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                RouteRequiredPermissions.get("manageCategories")!,
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

        const categories = await getCategories(page, rowsPerPage, search);
        const totalRows = await getCategoriesTotalRow(search);

        return buildSuccessResponse<FetchCategoriesData>(successMessage, {
            categories: categories,
            totalRows: totalRows,
            rowsPerPage: rowsPerPage,
            page: page,
            maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
