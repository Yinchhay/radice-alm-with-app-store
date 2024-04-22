import { users } from "@/drizzle/schema";
import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUnlistedUsersByRole } from "@/repositories/role";

type GetUnlistedUsersByRoleReturnType = Awaited<ReturnType<typeof getUnlistedUsersByRole>>;

export type FetchUnlistedUserToRole = {
    users: GetUnlistedUsersByRoleReturnType;
};

type Params = { params: { role_id: number } };
const successMessage = "Get unassigned users successfully";
const unsuccessMessage = "Get unassigned users failed";

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

        const unlistedUsers = await getUnlistedUsersByRole(Number(params.role_id));

        return buildSuccessResponse<FetchUnlistedUserToRole>(successMessage, {
            users: unlistedUsers,
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}