import { checkBearerAndPermission } from "@/lib/IAM";
import { generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import {
    validateAppPermissions,
    deleteExistingScreenshots,
    processScreenshots,
    insertScreenshots,
    reorderScreenshots,
} from "@/repositories/app/screenshots";
import {
    deleteOldFile,
    saveUploadedFile,
    validateFile,
    MAX_SCREENSHOTS,
} from "@/repositories/app/images";

const successMessage = "App screenshots updated successfully";
const unsuccessMessage = "Failed to update app screenshots";
type Params = { params: { app_id: string } };

// POST: Append new screenshots (without replacing existing ones)
export async function POST(request: NextRequest, { params }: Params) {
    try {
        // Check for Bearer Token and Permissions
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);

        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        // Validate app ID
        const appId = Number(params.app_id);
        if (isNaN(appId) || appId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate permissions
        try {
            await validateAppPermissions(appId, user.id, user.type);
        } catch (error: any) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("permission", error.message),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        // Get current screenshots to check count
        const { getAppScreenshots } = await import(
            "@/repositories/app_screenshot"
        );
        const currentScreenshots = await getAppScreenshots(appId);
        const currentCount = currentScreenshots ? currentScreenshots.length : 0;

        // Parse form data
        const formData = await request.formData();
        const screenshotFiles: File[] = [];

        // Extract all screenshot files
        for (const [key, value] of formData.entries()) {
            if (key === "screenshots" && value instanceof File) {
                screenshotFiles.push(value);
            }
        }

        if (screenshotFiles.length === 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "screenshots",
                    "No screenshot files provided",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate total screenshot count (current + new)
        if (currentCount + screenshotFiles.length > MAX_SCREENSHOTS) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "screenshots",
                    `Cannot add ${screenshotFiles.length} screenshots. Maximum ${MAX_SCREENSHOTS} total screenshots allowed. Current count: ${currentCount}`,
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Process and save new screenshots
        let newScreenshotPaths: string[] = [];
        const { insertAppScreenshots } = await import(
            "@/repositories/app_screenshot"
        );

        try {
            // Process new screenshots with proper indexing
            for (let i = 0; i < screenshotFiles.length; i++) {
                const file = screenshotFiles[i];

                // Validate file
                const fileValidation = validateFile(file);
                if (!fileValidation.valid) {
                    throw new Error(`File ${i + 1}: ${fileValidation.error}`);
                }

                // Save file with unique index
                const screenshotIndex = currentCount + i;
                const filePath = await saveUploadedFile(
                    file,
                    appId,
                    screenshotIndex.toString(),
                );
                newScreenshotPaths.push(filePath);
            }

            // Insert new screenshots into database
            const screenshotsToInsert = newScreenshotPaths.map(
                (path, index) => ({
                    appId,
                    imageUrl: path,
                    sortOrder: currentCount + index + 1,
                }),
            );

            const insertResult =
                await insertAppScreenshots(screenshotsToInsert);

            if (!insertResult.success) {
                throw new Error(
                    insertResult.error || "Failed to insert screenshots",
                );
            }

            // Reorder all screenshots to ensure proper sequence
            await reorderScreenshots(appId);
        } catch (fileError: any) {
            // Clean up any uploaded files if there was an error
            for (const screenshotPath of newScreenshotPaths) {
                await deleteOldFile(screenshotPath);
            }
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "screenshots",
                    `File operation failed: ${fileError.message}`,
                ),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        return buildSuccessResponse("Screenshots added successfully", {
            addedCount: newScreenshotPaths.length,
            totalCount: currentCount + newScreenshotPaths.length,
            newScreenshotPaths,
        });
    } catch (error: any) {
        return buildErrorResponse(
            unsuccessMessage,
            generateAndFormatZodError(
                "unknown",
                `Server error: ${error.message}`,
            ),
            HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        );
    }
}

// DELETE: Remove a specific screenshot by ID
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        // Check for Bearer Token and Permissions
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);

        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        // Validate app ID
        const appId = Number(params.app_id);
        if (isNaN(appId) || appId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate permissions
        try {
            await validateAppPermissions(appId, user.id, user.type);
        } catch (error: any) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("permission", error.message),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        // Get screenshot ID from query parameters
        const url = new URL(request.url);
        const screenshotId = url.searchParams.get("screenshot_id");

        if (!screenshotId) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "screenshot_id",
                    "Screenshot ID is required",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const screenshotIdNumber = Number(screenshotId);
        if (isNaN(screenshotIdNumber) || screenshotIdNumber <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "screenshot_id",
                    "Invalid screenshot ID",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const { getAppScreenshotById, deleteAppScreenshotById } = await import(
            "@/repositories/app_screenshot"
        );

        const screenshot = await getAppScreenshotById(screenshotIdNumber);
        if (!screenshot) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "screenshot_id",
                    "Screenshot not found",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (screenshot.appId !== appId) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "screenshot_id",
                    "Screenshot does not belong to this app",
                ),
                HttpStatusCode.FORBIDDEN_403,
            );
        }

        if (screenshot.imageUrl) {
            await deleteOldFile(screenshot.imageUrl);
        }

        await deleteAppScreenshotById(screenshotIdNumber);

        await reorderScreenshots(appId);

        return buildSuccessResponse("Screenshot deleted successfully", {
            deletedScreenshotId: screenshotIdNumber,
            deletedImageUrl: screenshot.imageUrl,
            operation: "deleted",
        });
    } catch (error: any) {
        return buildErrorResponse(
            unsuccessMessage,
            generateAndFormatZodError(
                "unknown",
                `Server error: ${error.message}`,
            ),
            HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        );
    }
}

// POST: Add new screenshots (append) - http://localhost:3000/api/internal/app/[app_id]/images/screenshots
// PATCH: Reorder screenshots - http://localhost:3000/api/internal/app/[app_id]/images/screenshots
// DELETE: Remove specific screenshot - http://localhost:3000/api/internal/app/[app_id]/images/screenshots?screenshot_id=123
