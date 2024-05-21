import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";

import { getRoleById } from "@/repositories/role";

type GetRoleReturnType = Awaited<ReturnType<typeof getRoleById>>;

export type FetchRoleData = {
    role: GetRoleReturnType;
};

type Params = { params: { role_id: number } };

const successMessage = "Get role successfully";
const unsuccessMessage = "Get role failed";

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

        const role = await getRoleById(Number(params.role_id));

        return buildSuccessResponse<FetchRoleData>(successMessage, {
            role: role,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
