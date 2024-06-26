import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
} from "@/lib/response";
import { getUserByEmail } from "@/repositories/users";
import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyCurrentEmailCodeSchema } from "../../schema";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";
import {
    generateVerificationCode,
    getVerificationCodeByUserIdAndType,
    verifyCodeByCodeAndType,
} from "@/repositories/code_verifications";
import { isWithinExpirationDate } from "oslo";
import { CodeVerificationType } from "@/drizzle/schema";
import { sendMail } from "@/smtp/mail";
import { checkBearerAndPermission } from "@/lib/IAM";

export type FetchVerifyCurrentEmailCodeData = Record<never, never>;

const successMessage = "Verify current email code successfully";
const unsuccessMessage = "Verify current email code failed";

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

        let body: z.infer<typeof verifyCurrentEmailCodeSchema> =
            await request.json();
        body.currentEmail = user.email;
        const validationResult = verifyCurrentEmailCodeSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const userExists = await getUserByEmail(body.newEmail);
        if (userExists) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "newEmail",
                    "Email already exists, please use another email",
                ),
            );
        }
        
        const verifiedCode = await verifyCodeByCodeAndType(
            body.code,
            CodeVerificationType.CHANGE_EMAIL,
            user.email,
        );
        if (!verifiedCode.success) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("code", verifiedCode.message),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }


        // check for existing code before generating new code
        const existingCode = await getVerificationCodeByUserIdAndType(
            user.id,
            CodeVerificationType.VERIFY_NEW_EMAIL,
        );

        if (existingCode && isWithinExpirationDate(existingCode.expiresAt)) {
            return buildSuccessResponse<FetchVerifyCurrentEmailCodeData>(
                successMessage,
                {},
            );
        }

        const eightDigitCode = await generateVerificationCode(
            user.id,
            CodeVerificationType.VERIFY_NEW_EMAIL,
            body.newEmail,
        );

        if (!eightDigitCode) {
            return buildErrorResponse(unsuccessMessage, 
                generateAndFormatZodError("code", "Failed to generate verification code")
            );
        }

        const mailResult = sendMail({
            subject: "Radice new email verification code",
            to: body.newEmail,
            text: `Your new email verification code is ${eightDigitCode}, please use this code to verify your new email address. 
            <br />
            <br />
            If you did not request this change, please ignore this email.`,
        });

        return buildSuccessResponse<FetchVerifyCurrentEmailCodeData>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}