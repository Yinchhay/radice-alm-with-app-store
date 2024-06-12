import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";

import { getRoleById } from "@/repositories/role";
import { Permissions } from "@/types/IAM";

export type GetRoleByIdReturnType = Awaited<ReturnType<typeof getRoleById>>;

export type FetchRoleByIdData = {
    role: GetRoleByIdReturnType;
};

type Params = { params: { role_id: number } };

const successMessage = "Get role by id successfully";
const unsuccessMessage = "Get role by id failed";

export async function GET(request: Request, { params }: Params) {
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

        const role = await getRoleById(Number(params.role_id));

        return buildSuccessResponse<FetchRoleByIdData>(successMessage, {
            role: role,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
