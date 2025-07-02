import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createApp, getAppsByProjectId } from "@/repositories/app";
import { HttpStatusCode } from "@/types/http";

export type FetchCreateApp = {
    appId: number;
};

const successMessage = "Created app successfully";
const unsuccessMessage = "Create app failed";

export async function POST(
    request: Request,
    { params }: { params: { project_id: string } },
) {
    try {
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);

        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }

        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const projectId = parseInt(params.project_id);
        if (isNaN(projectId) || projectId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                { project_id: "Invalid project ID" },
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const existingApps = await getAppsByProjectId(projectId);

        if (existingApps.length > 0) {
            const hasNonAccepted = existingApps.some(
                (app) => app.status !== "accepted",
            );

            if (hasNonAccepted) {
                return buildErrorResponse(
                    unsuccessMessage,
                    {
                        project_id:
                            "An app with non-accepted status already exists. Cannot create new app.",
                    },
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }
        }

        const createResult = await createApp({
            projectId,
            status: "draft",
        });

        let appId: number;

        if (Array.isArray(createResult) && createResult.length > 0) {
            if ("insertId" in createResult[0]) {
                appId = createResult[0].insertId as number;
            } else if ("id" in createResult[0]) {
                appId = (createResult[0] as any).id;
            } else {
                throw new Error("Unable to get app ID from create result");
            }
        } else {
            throw new Error(
                "Create operation did not return expected result",
            );
        }

        return buildSuccessResponse<FetchCreateApp>(successMessage, {
            appId,
        });
    } catch (createError: any) {
        if (
            createError.code === "ER_DUP_ENTRY" ||
            createError.message?.includes("UNIQUE constraint") ||
            createError.message?.includes("duplicate")
        ) {
            return buildErrorResponse(
                unsuccessMessage,
                {
                    project_id: "An app already exists for this project",
                },
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        return checkAndBuildErrorResponse(unsuccessMessage, createError);
    }
}
