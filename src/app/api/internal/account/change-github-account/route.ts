import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import { changeGithubSchema } from "../schema";
import { getUserByEmail } from "@/repositories/users";
import bcrypt from "bcrypt";
import { getOAuthProviderByUserId } from "@/repositories/oauth_provider";
import { isWithinExpirationDate } from "oslo";
import {
    generateVerificationCode,
    getVerificationCodeByUserIdAndType,
} from "@/repositories/code_verifications";
import { CodeVerificationType } from "@/drizzle/schema";
import { getBaseUrl } from "@/lib/server_utils";

export type FetchChangeGithubAccountData = {
    verifyCode: string;
};

const successMessage = "Change github account request successfully";
const unsuccessMessage = "Change github account request failed";

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

        let body: z.infer<typeof changeGithubSchema> = await request.json();
        const validationResult = changeGithubSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

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

        const userHasLinkedGithubOAuth = await getOAuthProviderByUserId(
            user.id,
        );

        if (!userHasLinkedGithubOAuth) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "github",
                    "You are currently not linked to any github account",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // verification code in db
        const existingCode = await getVerificationCodeByUserIdAndType(
            userHasLinkedGithubOAuth.userId,
            CodeVerificationType.CHANGE_GITHUB,
        );

        if (existingCode && isWithinExpirationDate(existingCode.expiresAt)) {
            return buildSuccessResponse<FetchChangeGithubAccountData>(
                successMessage,
                {
                    verifyCode: existingCode.code,
                },
            );
        }

        const eightDigitCode = await generateVerificationCode(
            userHasLinkedGithubOAuth.userId,
            CodeVerificationType.CHANGE_GITHUB,
        );

        if (!eightDigitCode) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "github",
                    "Failed to generate verification code",
                ),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        return buildSuccessResponse<FetchChangeGithubAccountData>(
            successMessage,
            {
                verifyCode: eightDigitCode,
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
