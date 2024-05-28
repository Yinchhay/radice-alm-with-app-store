import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUsersInRole } from "@/repositories/role";

type GetUsersByRoleReturnType = Awaited<ReturnType<typeof getUsersInRole>>;

export type FetchUsersInRole = {
    users: GetUsersByRoleReturnType;
};

type Params = { params: { role_id: number } };
const successMessage = "Get users in role successfully";
const unsuccessMessage = "Get users in role failed";

export async function GET(request: Request, { params }: Params) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                RouteRequiredPermissions.get("manageRoles")!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const usersInRole = await getUsersInRole(params.role_id);

        return buildSuccessResponse<FetchUsersInRole>(successMessage, {
            users: usersInRole,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}