import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createCategory } from "@/repositories/category";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createCategoryFormSchema } from "../schema";
import { fileImageSchema } from "../../project/[project_id]/schema";
import { lucia } from "@/auth/lucia";
import { uploadFiles } from "@/lib/file";

export type FetchCreateCategory = Record<string, never>;

const successMessage = "Create category successfully";
const unsuccessMessage = "Create category failed";

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([Permissions.CREATE_CATEGORIES]);
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
            const response = await uploadFiles(files, sessionId ?? "");

            if (!response.success) {
                const errorMessage =
                    response.errors[
                        Object.keys(
                            response.errors,
                        )[0] as keyof typeof response.errors
                    ];
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError("unknown", errorMessage),
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }
            logo = response.data.filenames[0];
        }

        const body: z.infer<typeof createCategoryFormSchema> = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            logo,
        };
        const validationResult = createCategoryFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const createResult = await createCategory(body);
        // if no row is affected, meaning that creating category failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        return buildSuccessResponse<FetchCreateCategory>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
