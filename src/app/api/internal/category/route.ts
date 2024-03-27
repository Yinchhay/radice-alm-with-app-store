import { generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getCategories } from "@/repositories/category";
import { ErrorMessage } from "@/types/error";

type GetCategoriesReturnType = Awaited<ReturnType<typeof getCategories>>;

export type FetchCategoriesData = {
    categories: GetCategoriesReturnType;
};

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
        return buildSuccessResponse(
            {
                categories: categories,
            } as FetchCategoriesData,
            "Get categories successfully.",
        );
    } catch (error: any) {
        return buildErrorResponse(
            "Get categories failed.",
            generateAndFormatZodError(
                "unknown",
                ErrorMessage.SomethingWentWrong,
            ),
        );
    }
}
