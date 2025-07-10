import { generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { updateAppStatus } from "@/repositories/app/internal";
import { revertVersionNumberOnReject } from "@/repositories/version";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";

// update type if we were to return any data back to the response
export type FetchRejectAppForm = Record<string, never>;

type Params = { params: { app_id: string } };

const successMessage = "Reject app successfully";
const unsuccessMessage = "Reject app failed";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const appId = Number(params.app_id);
        if (!params.app_id || isNaN(appId)) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid application ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const requiredPermission = new Set([Permissions.CHANGE_PROJECT_STATUS]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        // Revert version number first (majorVersion.minorVersion.patchVersion <- versionNumber)
        const versionReverted = await revertVersionNumberOnReject(appId);
        if (!versionReverted) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Failed to revert version number"),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        // Update app status to rejected
        const applicationForm = await updateAppStatus(appId, "rejected");
        if (!applicationForm) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Failed to reject application form because it does not exist or the form status is not pending",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchRejectAppForm>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}