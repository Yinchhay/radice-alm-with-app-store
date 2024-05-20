import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getAllCategories } from "@/repositories/category";
import { NextRequest } from "next/server";

export type GetCategoriesReturnType = Awaited<
    ReturnType<typeof getAllCategories>
>;

export type FetchAllCategories = {
    categories: GetCategoriesReturnType;
};

const successMessage = "Get all categories successfully";
const unsuccessMessage = "Get all categories failed";

// all category with no permission check because it's public information
export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, new Set([]));
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const categories = await getAllCategories();

        return buildSuccessResponse<FetchAllCategories>(successMessage, {
            categories: categories,
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
