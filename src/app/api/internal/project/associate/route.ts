import { checkBearerAndPermission } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import {
    getAssociatedProjectsByUserId,
    getAssociatedProjectsTotalRowByUserId,
} from "@/repositories/project";
import { NextRequest } from "next/server";
import { getAssociatedProjectFormSchema } from "../schema";
import { z } from "zod";
import { formatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";

type GetAssociatedProjectsReturnType = Awaited<
    ReturnType<typeof getAssociatedProjectsByUserId>
>;

export type FetchAssociatedProjectsData = {
    projects: GetAssociatedProjectsReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
};

const successMessage = "Get associated projects successfully";
const unsuccessMessage = "Get associated projects failed";

export async function GET(request: NextRequest) {
    try {
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let body: z.infer<typeof getAssociatedProjectFormSchema> = {
            userId: user.id,
        };
        const validationResult = getAssociatedProjectFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const page: number =
            Number(request.nextUrl.searchParams.get("page")) || 1;
        let rowsPerPage: number =
            Number(request.nextUrl.searchParams.get("rowsPerPage")) ||
            ROWS_PER_PAGE;

        // limit to max 100 rows per page
        if (rowsPerPage > 100) {
            rowsPerPage = 100;
        }

        const projects = await getAssociatedProjectsByUserId(
            user.id,
            page,
            rowsPerPage,
        );
        const totalRows = await getAssociatedProjectsTotalRowByUserId(user.id);

        return buildSuccessResponse<FetchAssociatedProjectsData>(
            successMessage,
            {
                projects: projects,
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
