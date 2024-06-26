import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { isWithinExpirationDate } from "oslo";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import { changeEmailSchema } from "../schema";
import { sendMail } from "@/smtp/mail";
import {
    generateVerificationCode,
    getVerificationCodeByUserIdAndType,
} from "@/repositories/code_verifications";
import { CodeVerificationType } from "@/drizzle/schema";

export type FetchChangeEmailSendEmailData = Record<string, never>;

const successMessage = "Request change email by send code successfully";
const unsuccessMessage = "Request change email by send code failed";

export async function POST(request: Request) {
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

        let body: z.infer<typeof changeEmailSchema> = await request.json();
        body.currentEmail = user.email;
        const validationResult = changeEmailSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const existingCode = await getVerificationCodeByUserIdAndType(
            user.id,
            CodeVerificationType.CHANGE_EMAIL,
        );

        if (existingCode && isWithinExpirationDate(existingCode.expiresAt)) {
            return buildErrorResponse(unsuccessMessage, {
                message: "Verification code is still valid, skip sending email",
            });
        }

        const eightDigitCode = await generateVerificationCode(
            user.id,
            CodeVerificationType.CHANGE_EMAIL,
        );

        if (!eightDigitCode) {
            return buildErrorResponse(unsuccessMessage, {
                message: "Failed to generate verification code",
            });
        }

        const mailResult = sendMail({
            subject: "Radice change email verification code",
            to: user.email,
            text: `You have requested to change your email. Your verification code is: ${eightDigitCode}, please use this code to verify that you acknowledge this change. 
            <br />
            <br />
            If you did not request this change, please ignore this email.`,
        });

        return buildSuccessResponse<FetchChangeEmailSendEmailData>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
