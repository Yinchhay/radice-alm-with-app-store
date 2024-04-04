import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getRoles } from "@/repositories/role";

type GetRolesReturnType = Awaited<ReturnType<typeof getRoles>>;

export type FetchRolesData = {
    roles: GetRolesReturnType;
};

const successMessage = "Get roles successfully";
const unsuccessMessage = "Get roles failed";

export async function GET(request: Request) {
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

        const roles = await getRoles();
        return buildSuccessResponse<FetchRolesData>(successMessage, {
            roles: roles,
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
