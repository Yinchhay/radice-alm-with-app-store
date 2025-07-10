import { lucia } from "@/auth/lucia";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
} from "@/lib/response";
import {
    getAllBugReportsByAppId,
    getBugReportsTotalRowByAppId,
} from "@/repositories/bug_report";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";

export type GetBugReportReturnType = Awaited<
    ReturnType<typeof getAllBugReportsByAppId>
>;

export type FetchBugReportData = {
    bugReports: GetBugReportReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
};

const successMessage = "Get bug reports successfully";
const unsuccessMessage = "Get bug reports failed";

export async function GET(
    request: NextRequest,
    { params }: { params: { app_id: string } },
) {
    try {
        // Get and validate session/user without permission checks
        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            return buildNoBearerTokenErrorResponse();
        }

        const { session, user } = await lucia.validateSession(sessionId);
        if (!session || !user) {
            return buildNoBearerTokenErrorResponse();
        }

        // Convert and validate appId
        const appId = parseInt(params.app_id, 10);
        if (isNaN(appId) || appId < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                { appId: "Invalid app ID" },
                HttpStatusCode.BAD_REQUEST_400,
            );
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

        const bugReports = await getAllBugReportsByAppId(
            appId,
            page,
            rowsPerPage
        );

        const totalRows = await getBugReportsTotalRowByAppId(appId);

        return buildSuccessResponse<FetchBugReportData>(successMessage, {
            bugReports: bugReports,
            totalRows: totalRows,
            rowsPerPage: rowsPerPage,
            page: page,
            maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
