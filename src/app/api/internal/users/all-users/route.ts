import { checkBearerAndPermission, RouteRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUsers } from "@/repositories/users";

type GetUsersReturnType = Awaited<ReturnType<typeof getUsers>>;

export type FetchUsersData = {
    users: GetUsersReturnType;
};

const successMessage = "Get all users successfully";
const unsuccessMessage = "Get all users failed";

export async function GET(request: Request) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                RouteRequiredPermissions.get("manageUsers")!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const users = await getUsers();
        return buildSuccessResponse<FetchUsersData>(successMessage, {
            users: users,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
