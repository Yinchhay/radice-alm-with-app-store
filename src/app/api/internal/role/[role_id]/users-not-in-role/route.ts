import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { filterGetOnlyUserNotInRole } from "@/repositories/role";

import { getUsersInRole } from "@/repositories/role";
import { getAllUsers } from "@/repositories/users";

type GetUsersNotInRoleReturnType = Awaited<ReturnType<typeof filterGetOnlyUserNotInRole>>;

export type FetchUsersNotInRole = {
    users: GetUsersNotInRoleReturnType;
};

type Params = { params: { role_id: number } };
const successMessage = "Get users not in role successfully";
const unsuccessMessage = "Get users not in role failed";

export async function GET(request: Request, { params }: Params) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                routeRequiredPermissions.get("manageRoles")!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const usersInRole = await getUsersInRole(params.role_id);
        const data = usersInRole.map((user) => {
            return {
                id: user.user.id,
                firstName: user.user.firstName,
                lastName: user.user.lastName,
                email: user.user.email,
            };
        });

        const usersNotInRole = filterGetOnlyUserNotInRole(data, await getAllUsers());

        return buildSuccessResponse<FetchUsersNotInRole>(successMessage, {
            users: usersNotInRole,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}