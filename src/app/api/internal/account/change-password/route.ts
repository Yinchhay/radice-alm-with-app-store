import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import { changePasswordSchema } from "../schema";
import { getUserByEmail, updateUserPassword } from "@/repositories/users";
import bcrypt from "bcrypt";
import { sendMail } from "@/smtp/mail";

export type FetchChangePasswordData = Record<string, never>;

const successMessage = "Change password successfully";
const unsuccessMessage = "Change password failed";

export async function PATCH(request: Request) {
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

        const body: z.infer<typeof changePasswordSchema> = await request.json();
        const validationResult = changePasswordSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        if (body.oldPassword === body.newPassword) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "oldPassword",
                    "New password must be different from the old password",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const userExists = await getUserByEmail(user.email);
        if (!userExists) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "oldPassword",
                    "User doesn't exist in the system",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const validPassword = await bcrypt.compare(
            body.oldPassword,
            userExists.password,
        );
        if (!validPassword) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "oldPassword",
                    "Password is incorrect",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const updateResult = await updateUserPassword(
            user.id,
            body.newPassword,
        );
        // if no row is affected, meaning that updating password fail
        if (updateResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        // remember in development, the email will be sent to default email (not the actual email user). check sendMail function in src/smtp/mail.ts
        const mailResult = await sendMail({
            subject: "Your Radice account password has been changed",
            to: user.email,
            text: `${userExists.firstName} ${userExists.lastName}, your password has been successfully changed. If you did not make this change, please contact us immediately.`,
        });

        return buildSuccessResponse<FetchChangePasswordData>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
