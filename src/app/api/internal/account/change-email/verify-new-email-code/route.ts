import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
} from "@/lib/response";
import { getUserByEmail, updateUserEmail } from "@/repositories/users";
import { NextRequest } from "next/server";
import { z } from "zod";
import { validateNewEmailSchema, verifyNewEmailCodeSchema } from "../../schema";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";
import { verifyCodeByCodeAndType } from "@/repositories/code_verifications";
import { CodeVerificationType } from "@/drizzle/schema";
import { checkBearerAndPermission } from "@/lib/IAM";
import { ErrorMessage } from "@/types/error";

export type FetchVerifyNewEmailCodeData = Record<never, never>;

const successMessage = "Verify new email code successfully";
const unsuccessMessage = "Verify new email code failed";

export async function PATCH(request: NextRequest) {
    try {
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let body: z.infer<typeof verifyNewEmailCodeSchema> =
            await request.json();
        const validationResult = verifyNewEmailCodeSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const verifiedCode = await verifyCodeByCodeAndType(
            body.code,
            CodeVerificationType.VERIFY_NEW_EMAIL,
            user.email,
        );
        if (!verifiedCode.success) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("code", verifiedCode.message),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const userExists = await getUserByEmail(
            verifiedCode.pendingChange as unknown as string,
        );
        if (userExists) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "newEmail",
                    "Email already exists, request again email change again",
                ),
            );
        }

        // validate pending change to ensure the pending change is email
        const validateEmail = validateNewEmailSchema.safeParse(
            verifiedCode.pendingChange,
        );
        if (!validateEmail.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validateEmail.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        const newEmail = validateEmail.data;

        const updateEmailResult = await updateUserEmail(user.id, newEmail);
        if (updateEmailResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        return buildSuccessResponse<FetchVerifyNewEmailCodeData>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
