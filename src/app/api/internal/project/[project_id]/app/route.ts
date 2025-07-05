import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import {
    createApp,
    getAppsByProjectId,
    getAppByIdForPublic,
} from "@/repositories/app/internal";
import { HttpStatusCode } from "@/types/http";

export type FetchCreateApp = {
    appId: number;
    isNewApp: boolean;
    status: string;
};

const successMessage = "App retrieved successfully";
const unsuccessMessage = "App operation failed";

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

        // Check if there's already a draft or rejected app
        const nonAcceptedApp = existingApps.find(
            (app) => app.status === "draft" || app.status === "rejected",
        );

        if (nonAcceptedApp) {
            // Return the existing draft/rejected app instead of creating a new one
            return buildSuccessResponse<FetchCreateApp>(
                "Found existing app in progress",
                {
                    appId: nonAcceptedApp.id,
                    isNewApp: false,
                    status: nonAcceptedApp.status ?? "unknown",
                },
            );
        }

        // No existing draft/rejected app found, create a new one
        // First, check if there's an accepted app to copy from
        const acceptedApp = existingApps.find(
            (app) => app.status === "accepted",
        );

        let appData;
        if (acceptedApp) {
            // Get the full accepted app data to copy
            const acceptedAppDetails = await getAppByIdForPublic(
                acceptedApp.id,
            );

            if (acceptedAppDetails) {
                appData = {
                    projectId,
                    status: "draft",
                    // Only include fields that are not null/undefined and match your schema
                    ...(acceptedAppDetails.subtitle && {
                        subtitle: acceptedAppDetails.subtitle,
                    }),
                    ...(acceptedAppDetails.aboutDesc && {
                        aboutDesc: acceptedAppDetails.aboutDesc,
                    }),
                    ...(acceptedAppDetails.content && {
                        content: acceptedAppDetails.content,
                    }),
                    ...(acceptedAppDetails.webUrl && {
                        webUrl: acceptedAppDetails.webUrl,
                    }),
                    ...(acceptedAppDetails.appFile && {
                        appFile: acceptedAppDetails.appFile,
                    }),
                    ...(acceptedAppDetails.cardImage && {
                        cardImage: acceptedAppDetails.cardImage,
                    }),
                    ...(acceptedAppDetails.bannerImage && {
                        bannerImage: acceptedAppDetails.bannerImage,
                    }),
                };
            } else {
                // Fallback if accepted app details can't be fetched
                appData = {
                    projectId,
                    status: "draft",
                };
            }
        } else {
            // No accepted app exists, create fresh draft
            appData = {
                projectId,
                status: "draft",
            };
        }

        const createResult = await createApp(appData);

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
            throw new Error("Create operation did not return expected result");
        }

        return buildSuccessResponse<FetchCreateApp>(
            acceptedApp
                ? "Created new app from accepted version"
                : "Created new app successfully",
            {
                appId,
                isNewApp: true,
                status: "draft",
            },
        );
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
