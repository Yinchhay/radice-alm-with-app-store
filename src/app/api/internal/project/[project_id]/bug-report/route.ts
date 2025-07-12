import { lucia } from "@/auth/lucia";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
} from "@/lib/response";
import {
    getAllBugReportsByProjectId,
    getBugReportsTotalRowByProjectId,
} from "@/repositories/bug_report";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export type GetBugReportsReturnType = Awaited<
    ReturnType<typeof getAllBugReportsByProjectId>
>;

export type FetchBugReportData = {
    bugReports: GetBugReportsReturnType;
    totalRows: number;
    rowsPerPage: number;
    page: number;
    maxPage: number;
};

const successMessage = "Get bug reports successfully";
const unsuccessMessage = "Get bug reports failed";

export async function GET(
    request: NextRequest,
    { params }: { params: { project_id: string } },
) {
    try {
        // Get and validate session/user without permission checks
        let sessionId: string | null = null;
        const authorizationHeader = request.headers.get("Authorization");
        sessionId = lucia.readBearerToken(authorizationHeader ?? "");
        
        if (!sessionId) {
            // Try to get session from cookies if not in Authorization header
            const cookieStore = cookies();
            sessionId = cookieStore.get("auth_session")?.value || cookieStore.get("__session")?.value || null;
        }
        
        if (!sessionId) {
            return buildNoBearerTokenErrorResponse();
        }

        const { session, user } = await lucia.validateSession(sessionId);
        if (!session || !user) {
            return buildNoBearerTokenErrorResponse();
        }

        // Convert and validate projectId
        const projectId = parseInt(params.project_id, 10);
        if (isNaN(projectId) || projectId < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                { projectId: "Invalid project ID" },
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

        const bugReports = await getAllBugReportsByProjectId(
            projectId,
            page,
            rowsPerPage
        );

        const totalRows = await getBugReportsTotalRowByProjectId(projectId);

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