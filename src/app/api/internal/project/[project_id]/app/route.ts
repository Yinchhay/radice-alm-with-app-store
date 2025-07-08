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
import { createVersion, getLatestVersionByAppId } from "@/repositories/version";
import { HttpStatusCode } from "@/types/http";
import { promises as fs } from 'fs';
import path from 'path';

export type FetchCreateApp = {
    appId: number;
    isNewApp: boolean;
    status: string;
};

const unsuccessMessage = "App operation failed";

// Configuration for file storage (should match your PATCH endpoint)
const FILE_STORAGE_PATH = path.join(process.cwd(), process.env.FILE_STORAGE_PATH || './public/uploads/apps');

// Helper function to copy an existing image file with new naming
async function copyImageFile(originalPath: string, newAppId: number, imageType: 'card' | 'banner'): Promise<string | null> {
    if (!originalPath) return null;
    
    try {
        // Extract the original filename from the path
        const originalFilename = path.basename(originalPath);
        const fileExtension = path.extname(originalFilename);
        const timestamp = Date.now();
        
        // Generate new filename for the new app
        const newFilename = `app_${newAppId}_${imageType}_image_${timestamp}${fileExtension}`;
        
        // Construct full paths
        const originalFullPath = path.join(FILE_STORAGE_PATH, originalFilename);
        const newFullPath = path.join(FILE_STORAGE_PATH, newFilename);
        
        // Check if original file exists
        await fs.access(originalFullPath);
        
        // Copy the file
        await fs.copyFile(originalFullPath, newFullPath);
        
        // Return the new path (relative to public directory)
        return `/uploads/apps/${newFilename}`;
        
    } catch (error) {
        console.warn(`Failed to copy ${imageType} image:`, error);
        return null;
    }
}

// Helper function to copy screenshots
async function copyScreenshots(originalAppId: number, newAppId: number): Promise<void> {
    try {
        const { getAppScreenshots, insertAppScreenshots } = await import("@/repositories/app_screenshot");
        
        // Get screenshots from the original app
        const originalScreenshots = await getAppScreenshots(originalAppId);
        
        if (!originalScreenshots || originalScreenshots.length === 0) {
            return;
        }
        
        const newScreenshots = [];
        
        for (let i = 0; i < originalScreenshots.length; i++) {
            const originalScreenshot = originalScreenshots[i];
            
            if (!originalScreenshot.imageUrl) continue;
            
            try {
                const originalFilename = path.basename(originalScreenshot.imageUrl);
                const fileExtension = path.extname(originalFilename);
                const timestamp = Date.now();
                
                // Generate new filename for the new app
                const newFilename = `app_${newAppId}_screenshot_${i}_${timestamp}${fileExtension}`;
                
                // Construct full paths
                const originalFullPath = path.join(FILE_STORAGE_PATH, originalFilename);
                const newFullPath = path.join(FILE_STORAGE_PATH, newFilename);
                
                // Check if original file exists and copy it
                await fs.access(originalFullPath);
                await fs.copyFile(originalFullPath, newFullPath);
                
                // Add to new screenshots array
                newScreenshots.push({
                    appId: newAppId,
                    imageUrl: `/uploads/apps/${newFilename}`,
                    sortOrder: originalScreenshot.sortOrder || (i + 1),
                });
                
            } catch (error) {
                console.warn(`Failed to copy screenshot ${i}:`, error);
                // Continue with other screenshots even if one fails
            }
        }
        
        // Insert new screenshots if any were successfully copied
        if (newScreenshots.length > 0) {
            await insertAppScreenshots(newScreenshots);
        }
        
    } catch (error) {
        console.error("Failed to copy screenshots:", error);
        // Don't throw error, just log it since screenshots are not critical
    }
}

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
            const acceptedAppDetails = await getAppByIdForPublic(acceptedApp.id);
            
            if (acceptedAppDetails) {
                const imageUpdates: any = {};
                
                // Copy card image if it exists
                if (acceptedAppDetails.cardImage) {
                    const newCardImagePath = await copyImageFile(
                        acceptedAppDetails.cardImage, 
                        appId, 
                        'card'
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
                        'banner'
                    );
                    if (newBannerImagePath) {
                        imageUpdates.bannerImage = newBannerImagePath;
                    }
                }
                
                // Update the app with the new image paths if any were copied
                if (Object.keys(imageUpdates).length > 0) {
                    const { editAppById } = await import("@/repositories/app/internal");
                    await editAppById(appId, imageUpdates);
                }
                
                // Copy screenshots asynchronously (don't wait for it to complete)
                copyScreenshots(acceptedApp.id, appId).catch(error => {
                    console.error("Failed to copy screenshots:", error);
                });
            }
        }

        let major = 1,
            minor = 0,
            patch = 0;

        if (acceptedApp) {
            const latestAcceptedVersion = await getLatestVersionByAppId(
                acceptedApp.id,
            );

            if (latestAcceptedVersion) {
                major = latestAcceptedVersion.majorVersion ?? 1;
                minor = latestAcceptedVersion.minorVersion ?? 0;
                patch = (latestAcceptedVersion.patchVersion ?? 0) + 1;
            }
        }

        const versionNumber = `${major}.${minor}.${patch}`;

        const versionContent = acceptedApp
            ? "- Draft created by cloning accepted app"
            : "- New draft app created from scratch";

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