import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createAppType } from "@/repositories/app_type";
import { formatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createAppTypeFormSchema } from "../schema";

export type FetchCreateAppType = Record<string, never>;

const successMessage = "Create app type successfully";
const unsuccessMessage = "Create app type failed";

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

        const data = await request.json();

        const body = {
            name: data.name as string,
            description: data.description as string,
        };

        const validationResult = createAppTypeFormSchema.safeParse(body);

        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400
            );
        }

        const createResult = await createAppType(validationResult.data);

        if (!createResult || !createResult.id) {
            throw new Error("Something went wrong");
        }

        return buildSuccessResponse<FetchCreateAppType>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
