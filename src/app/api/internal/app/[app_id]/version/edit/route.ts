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
import { apps, versions } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";

// Response type (if you want to return any extra data later)
export type UpdateVersionContentResponse = Record<string, never>;

type Params = { params: { app_id: string } };
const successMessage = "Version updated successfully";
const unsuccessMessage = "Version update failed";

// Validation schema
const schema = z.object({
    content: z.string().optional(),
    isCurrent: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
    try {
        const appId = Number(params.app_id);
        if (!params.app_id || isNaN(appId)) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const requiredPermission = new Set([]); // add roles if needed
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);

        if (errorNoBearerToken) return buildNoBearerTokenErrorResponse();
        if (errorNoPermission) return buildNoPermissionErrorResponse();

        const body = await request.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            const flattenErrors = Object.fromEntries(
                Object.entries(parsed.error.format()).map(([field, value]) => {
                    if (
                        typeof value === "object" &&
                        "_errors" in value &&
                        Array.isArray(value._errors)
                    ) {
                        return [
                            field,
                            value._errors.join(", ") || "Invalid input",
                        ];
                    }
                    return [field, "Invalid input"];
                }),
            );

            return buildErrorResponse(
                unsuccessMessage,
                flattenErrors,
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const { content, isCurrent } = parsed.data;

        // 1. Check if app exists and is not accepted
        const app = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
        });

        if (!app) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app", "App not found"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (app.status === "accepted") {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "status",
                    "Cannot edit version of an accepted app",
                ),
                HttpStatusCode.FORBIDDEN_403,
            );
        }

        // 2. Find latest version of the app
        const version = await db.query.versions.findFirst({
            where: eq(versions.appId, appId),
            orderBy: [desc(versions.createdAt)],
        });

        if (!version) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "version",
                    "No version found for this app",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // 3. Update content and isCurrent
        await db
            .update(versions)
            .set({
                content: content ?? version.content,
                isCurrent: isCurrent ?? version.isCurrent,
                updatedAt: new Date(),
            })
            .where(eq(versions.id, version.id));

        return buildSuccessResponse<UpdateVersionContentResponse>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
