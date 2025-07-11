import { generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { db } from "@/drizzle/db";
import { eq, and } from "drizzle-orm";
import { updateAppStatus } from "@/repositories/app/internal";
import { revertVersionNumberOnReject } from "@/repositories/version";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { sendMail } from "@/smtp/mail";
import { apps, users, projects } from "@/drizzle/schema";

// update type if we were to return any data back to the response
export type FetchRejectAppForm = Record<string, never>;

const successMessage = "Reject app successfully";
const unsuccessMessage = "Reject app failed";

export async function PATCH(
    request: Request, 
    { params }: { params: { app_id: string }},
) {
    try {

        const requiredPermission = new Set([Permissions.CHANGE_PROJECT_STATUS]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const appId = Number(params.app_id);
        
        // Parse request body for reasoning
        let reason = "";
        try {
            const body = await request.json();
            if (body && typeof body.reason === "string") {
                reason = body.reason;
            }
        } catch (e) {
            // ignore, keep reason as empty string
        }

        if (!params.app_id || isNaN(appId)) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid application ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const currentApp = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
        });

        if (!currentApp) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "App not found"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const project = await db.query.projects.findFirst({
            where: eq(projects.id, currentApp.projectId!),
        });

        if (!project || !project.userId) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "App has no associated user"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const submitter = await db.query.users.findFirst({
            where: eq(users.id, project.userId),
        });

        
        if (!submitter) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "App submitter not found"),
                HttpStatusCode.NOT_FOUND_404,
            );
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
        const updatedApp = await updateAppStatus(appId, "rejected");
        if (!updatedApp) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Failed to reject application form because it does not exist or the form status is not pending",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        await sendMail({
            subject: "Radice App Application rejected",
            to: submitter.email,
            text: `Dear ${submitter.firstName} ${submitter.lastName}, we regret to inform you that your App application has been rejected.<br /><br /><strong>Reason:</strong> ${reason || "No reason provided."}`,
        });

        return buildSuccessResponse<FetchRejectAppForm>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}