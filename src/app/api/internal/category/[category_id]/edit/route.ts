import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { editCategoryById } from "@/repositories/category";

import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { editCategoryFormSchema } from "../../schema";
import { lucia } from "@/auth/lucia";
import { deleteFile, uploadFiles } from "@/lib/file";
import { fileImageSchema } from "../../../project/[project_id]/schema";
import { FileBelongTo } from "@/drizzle/schema";

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

        const formData = await request.formData();
        // check if user sent a categoryLogo
        let logo;
        if (formData.has("categoryLogo")) {
            const file = formData.get("categoryLogo") as File;
            // validate file for its type, size
            const validationResult = fileImageSchema.safeParse({
                image: file,
            });
            if (!validationResult.success) {
                return buildErrorResponse(
                    unsuccessMessage,
                    formatZodError(validationResult.error),
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }
            const files = [file];
            const authorizationHeader = request.headers.get("Authorization");
            const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
            const response = await uploadFiles(files, {
                sessionId: sessionId ?? "",
                belongTo: FileBelongTo.Category,
            });

            if (!response.success) {
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError(
                        "unknown",
                        "Failed to upload image",
                    ),
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }

            await deleteFile(
                formData.get("currentCategoryLogo") as string,
                sessionId ?? "",
            );
            logo = response.data.filenames[0];
        }

        if (!logo) {
            logo = formData.get("currentCategoryLogo") as string;
        }

        let body: z.infer<typeof editCategoryFormSchema> = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            logo,
            categoryId: Number(params.category_id),
        };
        const validationResult = editCategoryFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const editResult = await editCategoryById(body.categoryId, body);
        // if no row is affected, meaning that the category didn't get edited
        if (editResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchEditCategory>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
