import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
} from "@/lib/response";
import { isWithinExpirationDate } from "oslo";
import { getUserByEmail, updateUserPassword } from "@/repositories/users";
import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyForgotPasswordCodeSchema } from "..//schema";
import { formatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";
import {
    getVerificationCodeByUserIdAndType,
    verifyCodeByCodeAndType,
} from "@/repositories/code_verifications";
import { CodeVerificationType } from "@/drizzle/schema";
import { sendMail } from "@/smtp/mail";
import { ErrorMessage } from "@/types/error";

export type FetchVerifyForgotPasswordCodeData = Record<never, never>;

const successMessage = "Verify forgot password code successfully";
const unsuccessMessage = "Verify forgot password code failed";

export async function POST(request: NextRequest) {
    try {
        let body: z.infer<typeof verifyForgotPasswordCodeSchema> =
            await request.json();
        const validationResult = verifyForgotPasswordCodeSchema.safeParse(body);
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
                message: "User not found",
            });
        }

        const verifiedCode = await verifyCodeByCodeAndType(
            body.code,
            CodeVerificationType.FORGOT_PASSWORD,
            userExists.email,
        );

        if (!verifiedCode.success) {
            return buildErrorResponse(unsuccessMessage, {
                message: verifiedCode.message,
            });
        }

        const updateResult = await updateUserPassword(
            userExists.id,
            body.newPassword,
        );
        // if no row is affected, meaning that updating password failed
        if (updateResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        // remember in development, the email will be sent to default email (not the actual email user). check sendMail function in src/smtp/mail.ts
        const mailResult = await sendMail({
            subject: "Your Radice account password has been reset",
            to: userExists.email,
            text: `${userExists.firstName} ${userExists.lastName}, your password has been successfully reset. If you did not request this change, please contact us immediately.`,
        });

        return buildSuccessResponse<FetchVerifyForgotPasswordCodeData>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
