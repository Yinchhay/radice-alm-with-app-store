import { generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { updateAppStatus } from "@/repositories/app";
import { sendMail } from "@/smtp/mail";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";

// update type if we were to return any data back to the response
export type FetchApproveAppForm = Record<string, never>;

type Params = { params: { app_id: string } };
const successMessage = "Approve app successfully";
const unsuccessMessage = "Approve app failed";

export async function PATCH(request: Request, { params }: Params) {
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

        const applicationForm = await updateAppStatus(
            Number(params.app_id),
            "accepted",
        );
        if (!applicationForm) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Failed to approve app because it does not exist or the status is not pending",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchApproveAppForm>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
