import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getCategories } from "@/repositories/category";

type GetCategoriesReturnType = Awaited<ReturnType<typeof getCategories>>;

export type FetchCategoriesData = {
    categories: GetCategoriesReturnType;
};

const successMessage = "Get categories successfully";
const unsuccessMessage = "Get categories failed";

export async function GET(request: Request) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                routeRequiredPermissions.get("manageCategories")!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const categories = await getCategories();
        return buildSuccessResponse<FetchCategoriesData>(successMessage, {
            categories: categories,
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
