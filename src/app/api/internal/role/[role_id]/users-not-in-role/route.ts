import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUsersNotInRole } from "@/repositories/role";
import { Permissions } from "@/types/IAM";
import { NextRequest } from "next/server";

export type GetUsersNotInRoleReturnType = Awaited<
    ReturnType<typeof getUsersNotInRole>
>;

export type FetchUsersNotInRole = {
    usersNotInRole: GetUsersNotInRoleReturnType;
};

type Params = { params: { role_id: number } };
const successMessage = "Get users not in role successfully";
const unsuccessMessage = "Get users not in role failed";

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                new Set([Permissions.EDIT_ROLES])!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let rowsPerPage: number =
            Number(request.nextUrl.searchParams.get("rowsPerPage")) ||
            ROWS_PER_PAGE;
        const search = request.nextUrl.searchParams.get("search") || "";

        // limit to max 100 rows per page
        if (rowsPerPage > 100) {
            rowsPerPage = 100;
        }

        const usersNotInRole = await getUsersNotInRole(params.role_id, search, rowsPerPage);

        return buildSuccessResponse<FetchUsersNotInRole>(successMessage, {
            usersNotInRole: usersNotInRole,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
