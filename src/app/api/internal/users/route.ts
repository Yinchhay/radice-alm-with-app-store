import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUsers } from "@/repositories/users";

type GetUsersReturnType = Awaited<ReturnType<typeof getUsers>>;

export type FetchUsersData = {
    users: GetUsersReturnType;
};

const successMessage = "Get users successfully";
const unsuccessMessage = "Get users failed";

export async function GET(request: Request) {
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

        const users = await getUsers();
        return buildSuccessResponse<FetchUsersData>(successMessage, {
            users: users,
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
