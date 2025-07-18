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
import {
    createVersion,
    getLatestVersionByProjectId,
} from "@/repositories/version";
import { HttpStatusCode } from "@/types/http";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { getAppScreenshots } from "@/repositories/app_screenshot";
import { copyImageFile, copyScreenshots } from "@/repositories/app/images";

export type FetchCreateApp = {
    appId: number;
    isNewApp: boolean;
    status: string;
    app: any;
};

const unsuccessMessage = "App operation failed";

// Configuration for file storage (should match your PATCH endpoint)
const FILE_STORAGE_PATH = path.join(
    process.cwd(),
    process.env.FILE_STORAGE_PATH || "public/uploads/apps",
);

export async function POST(
    request: Request,
    { params }: { params: { project_id: string } },
) {
    try {
        // to handle race conditions, we wait
        await new Promise((resolve) => setTimeout(resolve, 100));

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

        // Check if there's already a pending app
        const pendingApp = existingApps.find((app) => app.status === "pending");
        if (pendingApp) {
            // Fetch screenshots for the pending app
            const screenshots = await getAppScreenshots(pendingApp.id);
            const screenshotObjs = screenshots
                .filter((s) => s.imageUrl)
                .map((s) => ({ id: s.id, imageUrl: s.imageUrl }));
            return buildSuccessResponse(
                "Found pending app (cannot create or save another)",
                {
                    appId: pendingApp.id,
                    isNewApp: false,
                    status: pendingApp.status ?? "unknown",
                    app: {
                        id: pendingApp.id,
                        subtitle: pendingApp.subtitle,
                        type: pendingApp.type,
                        aboutDesc: pendingApp.aboutDesc,
                        content: pendingApp.content,
                        webUrl: pendingApp.webUrl,
                        appFile: pendingApp.appFile,
                        cardImage: pendingApp.cardImage,
                        bannerImage: pendingApp.bannerImage,
                        featuredPriority: pendingApp.featuredPriority,
                        status: pendingApp.status,
                        screenshots: screenshotObjs,
                    },
                },
            );
        }

        // Check if there's already a draft or rejected app
        const nonAcceptedApp = existingApps.find(
            (app) =>
                app.status === "draft" ||
                app.status === "rejected" ||
                app.status === "pending",
        );

        if (nonAcceptedApp) {
            // Fetch screenshots for the app
            const screenshots = await getAppScreenshots(nonAcceptedApp.id);
            const screenshotObjs = screenshots
                .filter((s) => s.imageUrl)
                .map((s) => ({ id: s.id, imageUrl: s.imageUrl }));
            return buildSuccessResponse("Found existing app in progress", {
                appId: nonAcceptedApp.id,
                isNewApp: false,
                status: nonAcceptedApp.status ?? "unknown",
                app: {
                    id: nonAcceptedApp.id,
                    subtitle: nonAcceptedApp.subtitle,
                    type: nonAcceptedApp.type,
                    aboutDesc: nonAcceptedApp.aboutDesc,
                    content: nonAcceptedApp.content,
                    webUrl: nonAcceptedApp.webUrl,
                    appFile: nonAcceptedApp.appFile,
                    cardImage: nonAcceptedApp.cardImage,
                    bannerImage: nonAcceptedApp.bannerImage,
                    featuredPriority: nonAcceptedApp.featuredPriority,
                    status: nonAcceptedApp.status,
                    screenshots: screenshotObjs,
                },
            });
        }

        // No existing draft/rejected app found, create a new one
        const acceptedApp = existingApps.find(
            (app) => app.status === "accepted",
        );

        let appData;
        if (acceptedApp) {
            const acceptedAppDetails = await getAppByIdForPublic(
                acceptedApp.id,
            );

            if (acceptedAppDetails) {
                appData = {
                    projectId,
                    status: "draft",
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
                    // Note: We'll handle images separately after getting the new app ID
                    ...(acceptedAppDetails.type && {
                        type: acceptedAppDetails.type,
                    }),
                    ...(acceptedAppDetails.featuredPriority && {
                        featuredPriority: acceptedAppDetails.featuredPriority,
                    }),
                };
            } else {
                appData = {
                    projectId,
                    status: "draft",
                };
            }
        } else {
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

        // Handle image copying if we're cloning from an accepted app
        if (acceptedApp) {
            const acceptedAppDetails = await getAppByIdForPublic(
                acceptedApp.id,
            );

            if (acceptedAppDetails) {
                const imageUpdates: any = {};

                // Copy card image if it exists
                if (acceptedAppDetails.cardImage) {
                    const newCardImagePath = await copyImageFile(
                        acceptedAppDetails.cardImage,
                        appId,
                        "card",
                    );
                    if (newCardImagePath) {
                        imageUpdates.cardImage = newCardImagePath;
                    }
                }

                // Copy banner image if it exists
                if (acceptedAppDetails.bannerImage) {
                    const newBannerImagePath = await copyImageFile(
                        acceptedAppDetails.bannerImage,
                        appId,
                        "banner",
                    );
                    if (newBannerImagePath) {
                        imageUpdates.bannerImage = newBannerImagePath;
                    }
                }

                // Update the app with the new image paths if any were copied
                if (Object.keys(imageUpdates).length > 0) {
                    const { editAppById } = await import(
                        "@/repositories/app/internal"
                    );
                    await editAppById(appId, imageUpdates);
                }

                // Copy screenshots asynchronously (don't wait for it to complete)
                copyScreenshots(acceptedApp.id, appId).catch((error) => {
                    console.error("Failed to copy screenshots:", error);
                });
            }
        }

        let major = 1,
            minor = 0,
            patch = 0;

        if (acceptedApp) {
            const latestAcceptedVersion = await getLatestVersionByProjectId(
                acceptedApp.projectId!,
            );

            if (latestAcceptedVersion) {
                major = latestAcceptedVersion.majorVersion ?? 1;
                minor = latestAcceptedVersion.minorVersion ?? 0;
                patch = latestAcceptedVersion.patchVersion ?? 0;
            }
        }

        const versionNumber = acceptedApp
            ? `${major}.${minor}.${patch}`
            : "1.0.0";

        const versionContent = acceptedApp
            ? "- Draft created by cloning accepted app"
            : "App Created";

        const versionResult = await createVersion({
            appId,
            projectId,
            versionNumber,
            majorVersion: major,
            minorVersion: minor,
            patchVersion: patch,
            isCurrent: false,
            content: versionContent,
        });

        let versionId: number;
        if (Array.isArray(versionResult) && versionResult.length > 0) {
            versionId =
                versionResult[0].insertId || (versionResult[0] as any).id;
        } else {
            throw new Error("Failed to create version");
        }

        // Fetch the full app object and its screenshots after creation
        const newAppDetails = await getAppByIdForPublic(appId);
        const newAppScreenshots = await getAppScreenshots(appId);
        const newAppScreenshotObjs = newAppScreenshots
            .filter((s) => s.imageUrl)
            .map((s) => ({ id: s.id, imageUrl: s.imageUrl }));

        return buildSuccessResponse<FetchCreateApp>(
            acceptedApp
                ? "Created new app from accepted version"
                : "Created new app successfully",
            {
                appId,
                isNewApp: true,
                status: "draft",
                app: {
                    ...newAppDetails,
                    screenshots: newAppScreenshotObjs,
                },
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

export async function GET(
    request: NextRequest,
    { params }: { params: { project_id: string } },
) {
    try {
        const projectId = parseInt(params.project_id, 10);
        if (isNaN(projectId)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid project ID",
                }),
                { status: 400 },
            );
        }
        const apps = await getAppsByProjectId(projectId);
        return buildSuccessResponse("Fetched apps for project", { apps });
    } catch (error: any) {
        return checkAndBuildErrorResponse(
            "Failed to fetch apps for project",
            error,
        );
    }
}
