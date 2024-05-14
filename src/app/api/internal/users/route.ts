import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUsers, getUsersTotalRow } from "@/repositories/users";
import { NextRequest } from "next/server";

type GetUsersReturnType = Awaited<ReturnType<typeof getUsers>>;

export type FetchUsersData = {
    users: GetUsersReturnType;
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
};

const successMessage = "Get users successfully";
const unsuccessMessage = "Get users failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                routeRequiredPermissions.get("manageUsers")!,
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

        const users = await getUsers(page, rowsPerPage);
        const totalRows = await getUsersTotalRow();

        return buildSuccessResponse<FetchUsersData>(successMessage, {
            users: users,
            totalRows: totalRows,
            rowsPerPage: rowsPerPage,
            maxPage: getPaginationMaxPage(totalRows, rowsPerPage),
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
