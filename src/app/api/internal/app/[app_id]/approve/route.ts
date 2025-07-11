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
import { getAcceptedAppByProjectId } from "@/repositories/app/internal";
import { updateAppStatus } from "@/repositories/app/internal";
import {
    setCurrentVersionByAppIdWithTransaction,
    finalizeVersionNumberOnAccept,
} from "@/repositories/version";
import { sendMail } from "@/smtp/mail";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { apps, users, projects } from "@/drizzle/schema";

// update type if we were to return any data back to the response
export type FetchApproveAppForm = Record<string, never>;


const successMessage = "Approve app successfully";
const unsuccessMessage = "Approve app failed";

export async function PATCH(
    request: Request, 
    { params }:  { params: { app_id: string }},
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

        const appId = Number(params);

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

        if (currentApp.status !== "pending")
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Cannot approve app that is not pending"
                ),
                HttpStatusCode.FORBIDDEN_403,
            );

        if (!currentApp.projectId) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "App has no projectId"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const project = await db.query.projects.findFirst({
            where: eq(projects.id, currentApp.projectId),
        });
        // const projectId = currentApp.projectId;

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

        // FINALIZE versionNumber based on major/minor/patch
        const versionFinalized = await finalizeVersionNumberOnAccept(appId);
        if (!versionFinalized) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Failed to finalize version number",
                ),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        // Start a transaction to ensure data consistency
        await db.transaction(async (tx) => {
            // Check for existing accepted app and delete if different
            const existingAcceptedApp =
                await getAcceptedAppByProjectId(currentApp.projectId!);
            if (existingAcceptedApp && existingAcceptedApp.id !== appId) {
                await tx
                    .delete(apps)
                    .where(eq(apps.id, existingAcceptedApp.id));
            }

            // Update app status to accepted
            const updatedApp = await updateAppStatus(appId, "accepted");
            if (!updatedApp) {
                throw new Error(
                    "Failed to approve app because it does not exist or is not pending",
                );
            }

            // Set latest version as current (transaction-aware)
            const versionUpdateSuccess =
                await setCurrentVersionByAppIdWithTransaction(
                    tx,
                    appId,
                    currentApp.projectId!,
                );
            if (!versionUpdateSuccess) {
                throw new Error("Failed to update version status");
            }
        });

        try {
            await sendMail({
                subject: "App have been Approved",
                to: submitter.email,
                text: `Dear ${submitter.firstName} ${submitter.lastName}, we are pleased to inform you that your App application has been approved.
                <br />
                <br />
                Email: ${submitter.email}
                <br />
                <br />
                <br />
                Thanks you`,
            })
        }
        catch(mailError){
            console.error("Failed to send approval email:", mailError);
            // Optional: Don't fail the whole request just because of email failure
        }


        return buildSuccessResponse<FetchApproveAppForm>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
