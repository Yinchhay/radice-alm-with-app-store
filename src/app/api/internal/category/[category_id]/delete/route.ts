import { deleteCategoryFormSchema } from "@/app/dashboard/manage/categories/schema";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { revalidateTags } from "@/lib/server_utils";
import {
    deleteCategoryById,
    GetCategories_C_Tag,
} from "@/repositories/category";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";

// update type if we were to return any data back to the response
export type FetchDeleteCategory = Record<string, never>;

type Params = { params: { category_id: string } };
const successMessage = "Delete category successfully";
const unsuccessMessage = "Delete category failed";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.DELETE_CATEGORIES]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const data: z.infer<typeof deleteCategoryFormSchema> = {
            categoryId: Number(params.category_id),
        };
        const validationResult = deleteCategoryFormSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const deleteResult = await deleteCategoryById(data.categoryId);
        // if no row is affected, meaning that the category didn't get deleted
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        revalidateTags<GetCategories_C_Tag>("getCategories_C");
        return buildSuccessResponse<FetchDeleteCategory>(successMessage, {});
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}