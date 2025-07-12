import { lucia } from "@/auth/lucia";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
} from "@/lib/response";
import {
    getAllFeedbacksByProjectId,
    getFeedbacksTotalRowByProjectId,
} from "@/repositories/feedback";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export type GetFeedbacksReturnType = Awaited<
    ReturnType<typeof getAllFeedbacksByProjectId>
>;

export type FetchFeedbacksData = {
    feedbacks: GetFeedbacksReturnType;
    totalRows: number;
    rowsPerPage: number;
    page: number;
    maxPage: number;
};

const successMessage = "Get feedbacks successfully";
const unsuccessMessage = "Get feedbacks failed";

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

        const feedbacks = await getAllFeedbacksByProjectId(
            projectId,
            page,
            rowsPerPage
        );

        const totalRows = await getFeedbacksTotalRowByProjectId(projectId);

        return buildSuccessResponse<FetchFeedbacksData>(successMessage, {
            feedbacks: feedbacks,
            totalRows: totalRows,
            rowsPerPage: rowsPerPage,
            page: page,
            maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
} 