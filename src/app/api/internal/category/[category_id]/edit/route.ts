import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { revalidateTags } from "@/lib/server_utils";
import { editCategoryById, GetCategories_C_Tag } from "@/repositories/category";

import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { editCategoryFormSchema } from "../../schema";
import {
    GetProjects_C_Tag,
    OneAssociatedProject_C_Tag,
} from "@/repositories/project";

export type FetchEditCategory = Record<string, never>;

type Params = { params: { category_id: string } };
const successMessage = "Edit category successfully";
const unsuccessMessage = "Edit category failed";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.EDIT_CATEGORIES]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const body: z.infer<typeof editCategoryFormSchema> =
            await request.json();
        body.categoryId = Number(params.category_id);
        const validationResult = editCategoryFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const editResult = await editCategoryById(body.categoryId, body);
        // if no row is affected, meaning that the category didn't get edited
        if (editResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        await revalidateTags<
            GetCategories_C_Tag | OneAssociatedProject_C_Tag | GetProjects_C_Tag
        >("getCategories_C", "OneAssociatedProject_C_Tag", "getProjects_C_Tag");
        return buildSuccessResponse<FetchEditCategory>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
