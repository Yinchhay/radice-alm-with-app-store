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
import { updateProfileInformationFormSchema } from "../schema";
import { fileImageSchema } from "../../project/[project_id]/schema";
import { lucia } from "@/auth/lucia";
import { deleteFile, uploadFiles } from "@/lib/file";
import { updateUserProfileInformation } from "@/repositories/users";

export type FetchUpdateProfileInformation = Record<string, never>;

const successMessage = "Update profile information successfully";
const unsuccessMessage = "Update profile information failed";

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

        const formData = await request.formData();
        // check if user sent a profileLogo
        let profileLogo;
        if (formData.has("profileLogo")) {
            const file = formData.get("profileLogo") as File;
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
            
            await deleteFile(formData.get("currentProfileLogo") as string, sessionId ?? "");
            profileLogo = response.data.filenames[0];
        }

        if (!profileLogo) {
            profileLogo = formData.get("currentProfileLogo") as string;
        }

        const skillSet = formData.get("skillSet");
        let body: z.infer<typeof updateProfileInformationFormSchema> = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            skillSet: skillSet
                ? JSON.parse(skillSet as string)
                : ([] as string[]),
            description: formData.get("description") as string,
            profileLogo,
        };
        const validationResult =
            updateProfileInformationFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const updateResult = await updateUserProfileInformation(user.id, body);
        // if no row is affected, meaning that creating profile failed
        if (updateResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        return buildSuccessResponse<FetchUpdateProfileInformation>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
