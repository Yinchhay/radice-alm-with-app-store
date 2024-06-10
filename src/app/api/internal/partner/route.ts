import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPartners, getPartnersTotalRow } from "@/repositories/partner";
import { NextRequest } from "next/server";

type GetPartnersReturnType = Awaited<ReturnType<typeof getPartners>>;

export type FetchPartnersData = {
    partners: GetPartnersReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
};

const successMessage = "Get partners successfully";
const unsuccessMessage = "Get partners failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                RouteRequiredPermissions.get("managePartners")!,
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
        // const categorySearch = request.nextUrl.searchParams.get("search") || "";

        // limit to max 100 rows per page
        if (rowsPerPage > 100) {
            rowsPerPage = 100;
        }

        const partners = await getPartners(page, rowsPerPage);
        const totalRows = await getPartnersTotalRow();

        return buildSuccessResponse<FetchPartnersData>(successMessage, {
            partners: partners,
            totalRows: totalRows,
            rowsPerPage: rowsPerPage,
            maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
            page: page,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
