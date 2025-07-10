import { db } from "@/drizzle/db";
import { apps } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentAndAllPreviousVersionsByProjectId } from "@/repositories/version";
import {
    buildErrorResponse,
    buildSuccessResponse,
    checkAndBuildErrorResponse,
} from "@/lib/response";
import { generateAndFormatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";

type Params = { params: { app_id: string } };

const successMessage = "Fetched current and previous versions successfully";
const unsuccessMessage = "Failed to fetch versions";

export async function GET(request: Request, { params }: Params) {
    try {
        const appId = Number(params.app_id);

        const app = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
        });

        if (!app) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "App not found"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (!app.projectId) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "project_id",
                    "App has no associated project",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const { current, previous } =
            await getCurrentAndAllPreviousVersionsByProjectId(app.projectId);

        return buildSuccessResponse(successMessage, { current, previous });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
