import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
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

        const search = request.nextUrl.searchParams.get("search") ?? "";

        const usersNotInRole = await getUsersNotInRole(params.role_id, search);

        return buildSuccessResponse<FetchUsersNotInRole>(successMessage, {
            usersNotInRole: usersNotInRole,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
