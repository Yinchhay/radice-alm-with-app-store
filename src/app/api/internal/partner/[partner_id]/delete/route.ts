import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { deletePartnerById, getPartnerById } from "@/repositories/partner";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { deletePartnerFormSchema } from "../../schema";
import { UserType } from "@/types/user";
import { lucia } from "@/auth/lucia";
import { deleteFile } from "@/lib/file";

// update type if we were to return any data back to the response
export type FetchDeletePartner = Record<string, never>;

type Params = { params: { partner_id: string } };
const successMessage = "Delete partner successfully";
const unsuccessMessage = "Delete partner failed";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.DELETE_PARTNERS]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let data: z.infer<typeof deletePartnerFormSchema> = {
            partnerId: params.partner_id,
        };
        const validationResult = deletePartnerFormSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        data = validationResult.data;

        const existingUser = await getPartnerById(data.partnerId);
        if (!existingUser) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (
            user.type !== UserType.SUPER_ADMIN &&
            existingUser.type === UserType.PARTNER
        ) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "You are not allowed to delete super admin account",
                ),
                HttpStatusCode.NOT_ACCEPTABLE_406,
            );
        }

        if (existingUser.profileUrl) {
            const authorizationHeader = request.headers.get("Authorization");
            const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
            await deleteFile(existingUser.profileUrl, sessionId ?? "");
        }

        const deleteResult = await deletePartnerById(data.partnerId);
        // if no row is affected, meaning that the partner didn't get deleted
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchDeletePartner>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
