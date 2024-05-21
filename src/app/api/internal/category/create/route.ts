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
import { createCategory, GetCategories_C_Tag } from "@/repositories/category";

import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createCategoryFormSchema } from "../schema";
import { GetProjects_C_Tag, OneAssociatedProject_C_Tag } from "@/repositories/project";

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
        const body: z.infer<typeof createCategoryFormSchema> =
            await request.json();
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

        await revalidateTags<GetCategories_C_Tag | OneAssociatedProject_C_Tag | GetProjects_C_Tag>("getCategories_C", "OneAssociatedProject_C_Tag", "getProjects_C_Tag");
        return buildSuccessResponse<FetchCreateCategory>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
