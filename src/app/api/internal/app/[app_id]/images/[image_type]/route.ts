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
    editAppById,
    getAppById,
    getAssociatedProjectsOfApp,
} from "@/repositories/app/internal";
import { checkProjectRole } from "@/lib/project";
import { getOneAssociatedProject } from "@/repositories/project";
import { validateFile, deleteOldFile, saveUploadedFile } from "@/repositories/app/images";

const successMessage = "App image updated successfully";
const unsuccessMessage = "Failed to update app image";

type Params = { params: { app_id: string; image_type: string } };


// Helper function to validate permissions
async function validateAppPermissions(
    appId: number,
    userId: string,
    userType: string,
) {
    // Check if app exists
    const app = await getAppById(appId);
    if (!app) {
        throw new Error("App does not exist");
    }

    // Get associated projects to check permissions
    const associatedProjects = await getAssociatedProjectsOfApp(appId);
    if (!associatedProjects || associatedProjects.length === 0) {
        throw new Error("Associated project not found");
    }

    const projectId = associatedProjects[0].project.id;
    const projectWithMembersAndPartners =
        await getOneAssociatedProject(projectId);

    if (!projectWithMembersAndPartners) {
        throw new Error("Project data not found");
    }

    // Check for Project Role
    const { canEdit } = checkProjectRole(
        userId,
        projectWithMembersAndPartners,
        userType,
    );
    if (!canEdit) {
        throw new Error("Unauthorized to edit this app");
    }

    return app;
}

// POST: Upload/Replace image
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
        const imageType = params.image_type;

        if (isNaN(appId) || appId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate image type
        if (!["card", "banner"].includes(imageType)) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "image_type",
                    "Invalid image type. Must be 'card' or 'banner'",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate permissions
        let app;
        try {
            app = await validateAppPermissions(appId, user.id, user.type);
        } catch (error: any) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("permission", error.message),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        // Parse form data
        const formData = await request.formData();
        const imageFile = formData.get("image") as File;

        if (!imageFile) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("image", "No image file provided"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate file
        const validation = validateFile(imageFile);
        if (!validation.valid) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("image", validation.error!),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Delete old image if exists
        const oldImagePath =
            imageType === "card" ? app.cardImage : app.bannerImage;
        if (oldImagePath) {
            await deleteOldFile(oldImagePath);
        }

        // Save new image
        const newImagePath = await saveUploadedFile(
            imageFile,
            appId,
            imageType,
        );

        // Update database
        const updateData =
            imageType === "card"
                ? { cardImage: newImagePath }
                : { bannerImage: newImagePath };

        const result = await editAppById(appId, updateData);

        if (!result.updateSuccess || !result.updatedApp) {
            // Clean up uploaded file if database update failed
            await deleteOldFile(newImagePath);

            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    result.error || "Failed to update app in database",
                ),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        return buildSuccessResponse(successMessage, {
            updateSuccess: result.updateSuccess,
            updatedApp: result.updatedApp,
            imageType,
            imagePath: newImagePath,
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

// DELETE: Remove image
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
        const imageType = params.image_type;

        if (isNaN(appId) || appId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate image type
        if (!["card", "banner"].includes(imageType)) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "image_type",
                    "Invalid image type. Must be 'card' or 'banner'",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Validate permissions
        let app;
        try {
            app = await validateAppPermissions(appId, user.id, user.type);
        } catch (error: any) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("permission", error.message),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        // Get current image path
        const currentImagePath =
            imageType === "card" ? app.cardImage : app.bannerImage;

        if (!currentImagePath) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("image", "No image to delete"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Delete file
        await deleteOldFile(currentImagePath);

        const updateData =
            imageType === "card"
                ? { cardImage: undefined }
                : { bannerImage: undefined };

        const result = await editAppById(appId, updateData);

        if (!result.updateSuccess || !result.updatedApp) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    result.error || "Failed to update app in database",
                ),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        return buildSuccessResponse("App image deleted successfully", {
            updateSuccess: result.updateSuccess,
            updatedApp: result.updatedApp,
            imageType,
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
