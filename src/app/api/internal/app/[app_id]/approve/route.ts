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
import { sendMail } from "@/smtp/mail";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { apps } from "@/drizzle/schema";

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

        const appId = Number(params.app_id);
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

        if (currentApp.projectId === null) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "App has no projectId"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const existingAcceptedApp = await getAcceptedAppByProjectId(
            currentApp.projectId,
        );

        if (existingAcceptedApp && existingAcceptedApp.id !== appId) {
            await db.delete(apps).where(eq(apps.id, existingAcceptedApp.id));
        }

        if (existingAcceptedApp) {
            await db.delete(apps).where(eq(apps.id, existingAcceptedApp.id));
        }

        const updatedApp = await updateAppStatus(appId, "accepted");

        if (!updatedApp) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Failed to approve app because it does not exist or is not pending",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchApproveAppForm>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}

