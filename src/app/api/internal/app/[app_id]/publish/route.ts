import { z } from "zod"; // <--- ✅ Import Zod

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
import { updateVersionPartsOnPublish } from "@/repositories/version";
import { updateAppStatus } from "@/repositories/app/internal";
import { HttpStatusCode } from "@/types/http";
import { apps, versions } from "@/drizzle/schema";

export type FetchPublishAppForm = Record<string, never>;

type Params = { params: { app_id: string } };

const successMessage = "App published (status set to pending)";
const unsuccessMessage = "Failed to publish app";

const schema = z.object({
    updateType: z.enum(["major", "minor", "patch", "initialize"]),
    whatsNew: z.string().max(300).optional(),
});

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);

        if (errorNoBearerToken) return buildNoBearerTokenErrorResponse();
        if (errorNoPermission) return buildNoPermissionErrorResponse();

        const appId = Number(params.app_id);
        if (!appId || isNaN(appId)) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400
            );
        }

        const body = await request.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            const errorMap = Object.fromEntries(
                Object.entries(parsed.error.format()).map(([field, value]) => {
                    if ("_errors" in value && Array.isArray(value._errors)) {
                        return [field, value._errors.join(", ")];
                    }
                    return [field, "Invalid input"];
                })
            );

            return buildErrorResponse(
                unsuccessMessage,
                errorMap,
                HttpStatusCode.BAD_REQUEST_400
            );
        }

        const { updateType, whatsNew } = parsed.data;

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
        
        if (existingApp.status === "accepted") {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("status", "App with 'accepted' status cannot be published"),
                HttpStatusCode.FORBIDDEN_403
            );
        }

        // Check if there is an accepted version for this app
        const acceptedVersion = await db.query.versions.findFirst({
            where: eq(versions.appId, appId),
            // Only consider versions with a finalized versionNumber (i.e., accepted)
            // This assumes versionNumber is only set on acceptance
            // If you have a status field, you can also check for status === 'accepted'
            // but here we just check for versionNumber
            orderBy: [versions.createdAt],
        });

        // Only increment version if there is an accepted version
        if (acceptedVersion && acceptedVersion.versionNumber) {
            await updateVersionPartsOnPublish(appId, updateType);
        }

        // Save 'whatsNew' content to the current version
        if (typeof whatsNew === 'string' && whatsNew.trim().length > 0) {
            const version = await db.query.versions.findFirst({ where: eq(versions.appId, appId) });
            if (version) {
                await db.update(versions).set({ contentId: whatsNew, updatedAt: new Date() }).where(eq(versions.id, version.id));
            }
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