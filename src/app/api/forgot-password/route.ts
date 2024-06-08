import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
} from "@/lib/response";
import { isWithinExpirationDate } from "oslo";
import { getUserByEmail } from "@/repositories/users";
import { NextRequest } from "next/server";
import { z } from "zod";
import { forgotPasswordSchema } from "./schema";
import { formatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";
import {
    generateVerificationCode,
    getVerificationCodeByUserIdAndType,
} from "@/repositories/code_verifications";
import { CodeVerificationType } from "@/drizzle/schema";
import { sendMail } from "@/smtp/mail";

export type FetchForgotPasswordSendEmail = Record<never, never>;

const successMessage = "Send verification code successfully";
const unsuccessMessage = "Send verification code failed";

export async function POST(request: NextRequest) {
    try {
        let body: z.infer<typeof forgotPasswordSchema> = await request.json();
        const validationResult = forgotPasswordSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const userExists = await getUserByEmail(body.email);
        if (!userExists) {
            return buildErrorResponse(unsuccessMessage, {
                message: "User not found, skip sending email",
            });
        }
        const existingCode = await getVerificationCodeByUserIdAndType(
            userExists.id,
            CodeVerificationType.FORGOT_PASSWORD,
        );

        // normally we set expire date 5min, if the code exist and not expired yet. skip sending email to user to avoid spamming
        if (existingCode && isWithinExpirationDate(existingCode.expiresAt)) {
            return buildErrorResponse(unsuccessMessage, {
                message: "Verification code is still valid, skip sending email",
            });
        }

        const eightDigitCode = await generateVerificationCode(
            userExists.id,
            CodeVerificationType.FORGOT_PASSWORD,
        );

        if (!eightDigitCode) {
            return buildErrorResponse(unsuccessMessage, {
                message: "Failed to generate verification code",
            });
        }

        // remember in development, the email will be sent to default email (not the actual email user). check sendMail function in src/smtp/mail.ts
        const mailResult = await sendMail({
            subject: "Radice forgot password verification code",
            to: userExists.email,
            text:
                "Your verification code is: " +
                eightDigitCode +
                "\n\nPlease keep this information safe and do not share it with anyone.",
        });

        return buildSuccessResponse<FetchForgotPasswordSendEmail>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
