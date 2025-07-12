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
import { eq } from "drizzle-orm";
import { getAcceptedAppByProjectId } from "@/repositories/app/internal";
import { updateAppStatus } from "@/repositories/app/internal";
import {
    setCurrentVersionByAppIdWithTransaction,
    finalizeVersionNumberOnAccept,
    createVersion,
} from "@/repositories/version";
import { updateIsAppStatus } from "@/repositories/project";
import { sendMail } from "@/smtp/mail";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { apps, users, projects, projectMembers, versions } from "@/drizzle/schema";

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
        // Safeguard: ensure a version exists for this app
        const existingVersion = await db.query.versions.findFirst({
            where: eq(versions.appId, appId),
        });
        if (!existingVersion) {
            await createVersion({
                appId,
                projectId: currentApp.projectId!,
                versionNumber: "1.0.0",
                majorVersion: 1,
                minorVersion: 0,
                patchVersion: 0,
                isCurrent: false,
                content: "App Created (auto-generated safeguard)",
            });
        }
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

        await db.transaction(async (tx) => {
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

            const versionUpdateSuccess =
                await setCurrentVersionByAppIdWithTransaction(
                    tx,
                    appId,
                    currentApp.projectId!,
                );
            if (!versionUpdateSuccess) {
                throw new Error("Failed to update version status");
            }
            await updateIsAppStatus(Number(updatedApp.projectId), true);
        });

        const members = await db.query.projectMembers.findMany({
            where: eq(projectMembers.projectId, currentApp.projectId!),
            with: {
                user: true,
            },
        });

        const allRecipients = new Set<string>();
        allRecipients.add(submitter.email);

        for (const member of members) {
            if (member.user?.email) {
                allRecipients.add(member.user.email);
            }
        }

        
        for(const email of allRecipients){
            try {

                await sendMail({
                    subject: "App have been Approved",
                    to: email,
                    text: `Dear Team Member, we are pleased to inform you that your App application has been approved.
                    <br />
                    <br />
                    <strong>Reason:</strong> ${reason || "No reason provided."}
                    <br />
                    <br />
                    Thanks you`,
                });

            } catch (mailError){
                console.error(`Failed to send email to ${email}:`, mailError);
            // Optional: Don't fail the whole request just because of email failure
            }
        }

        return buildSuccessResponse<FetchApproveAppForm>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
