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
import { updateAppStatus } from "@/repositories/app/internal";
import { HttpStatusCode } from "@/types/http";
import { apps } from "@/drizzle/schema";

export type FetchPublishAppForm = Record<string, never>;

type Params = { params: { app_id: string } };

const successMessage = "App published (status set to pending)";
const unsuccessMessage = "Failed to publish app";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([]); // Add permissions if needed
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);

        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const appId = Number(params.app_id);
        const existingApp = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
        });

        if (!existingApp) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "App not found"),
                HttpStatusCode.NOT_FOUND_404
            );
        }

        const updatedApp = await updateAppStatus(appId, "pending");

        if (!updatedApp) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "App could not be updated or does not exist"
                ),
                HttpStatusCode.BAD_REQUEST_400
            );
        }

        return buildSuccessResponse<FetchPublishAppForm>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
