import { checkBearerAndPermission } from "@/lib/IAM";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { NextRequest, NextResponse } from "next/server";
import {
    editAppById,
    getAppById,
    getAssociatedProjectsOfApp,
} from "@/repositories/app/internal";
import { checkProjectRole } from "@/lib/project";
import { editAppFormSchema } from "../../schema";
import { getOneAssociatedProject } from "@/repositories/project";
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const successMessage = "App updated successfully";
const unsuccessMessage = "Failed to update app";

// Configuration for file uploads
const FILE_STORAGE_PATH = path.join(process.cwd(), process.env.FILE_STORAGE_PATH || './public/uploads/apps');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_SCREENSHOTS = 10;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

type Params = { params: { app_id: string } };

export type FetchEditApp = Awaited<ReturnType<typeof editAppById>>;

// Helper function to ensure upload directory exists
async function ensureUploadDir() {
    try {
        await fs.access(FILE_STORAGE_PATH);
    } catch {
        await fs.mkdir(FILE_STORAGE_PATH, { recursive: true });
    }
}

// Helper function to delete old file
async function deleteOldFile(filePath: string) {
    if (!filePath) return;
    
    try {
        const fullPath = path.join(FILE_STORAGE_PATH, path.basename(filePath));
        await fs.access(fullPath);
        await fs.unlink(fullPath);
        console.log(`Deleted old file: ${fullPath}`);
    } catch (error) {
        console.warn(`Could not delete old file: ${filePath}`, error);
    }
}

// Helper function to save uploaded file
async function saveUploadedFile(file: File, appId: number, fileType: 'image' | 'screenshot', index?: number): Promise<string> {
    await ensureUploadDir();
    
    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const timestamp = Date.now();
    let uniqueFilename: string;
    
    if (fileType === 'screenshot' && index !== undefined) {
        uniqueFilename = `app_${appId}_screenshot_${index}_${timestamp}${fileExtension}`;
    } else {
        uniqueFilename = `app_${appId}_${fileType}_${timestamp}${fileExtension}`;
    }
    
    const filePath = path.join(FILE_STORAGE_PATH, uniqueFilename);
    
    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    // Return absolute path for Next.js compatibility
    return `/uploads/apps/${uniqueFilename}`;  // Added leading slash here
}

// Helper function to validate file
function validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
        };
    }
    
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        };
    }
    
    return { valid: true };
}

// Helper function to process screenshots
async function processScreenshots(screenshots: File[], appId: number): Promise<string[]> {
    const screenshotPaths: string[] = [];
    
    for (let i = 0; i < screenshots.length; i++) {
        const screenshot = screenshots[i];
        const validation = validateFile(screenshot);
        
        if (!validation.valid) {
            throw new Error(`Screenshot ${i + 1}: ${validation.error}`);
        }
        
        const screenshotPath = await saveUploadedFile(screenshot, appId, 'screenshot', i);
        screenshotPaths.push(screenshotPath);
    }
    
    return screenshotPaths;
}

// Helper function to insert screenshots into database
async function insertScreenshots(appId: number, screenshotPaths: string[]) {
    const { insertAppScreenshots } = await import("@/repositories/app_screenshot");
    
    const screenshots = screenshotPaths.map((path, index) => ({
        appId,
        imageUrl: path,
        sortOrder: index + 1,
    }));
    
    return await insertAppScreenshots(screenshots);
}

// Helper function to delete existing screenshots
async function deleteExistingScreenshots(appId: number) {
    const { deleteAppScreenshots, getAppScreenshots } = await import("@/repositories/app_screenshot");
    
    // Get existing screenshots to delete files
    const existingScreenshots = await getAppScreenshots(appId);
    
    // Delete files from storage
    if (existingScreenshots && existingScreenshots.length > 0) {
        for (const screenshot of existingScreenshots) {
            if (screenshot.imageUrl) {
                await deleteOldFile(screenshot.imageUrl);
            }
        }
    }
    
    // Delete from database
    return await deleteAppScreenshots(appId);
}

export async function PATCH(request: NextRequest, { params }: Params) {
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

        // Check if app exists first
        const app = await getAppById(appId);
        
        if (!app) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "App does not exist"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // Handle multipart/form-data for file uploads
        const contentType = request.headers.get('content-type');
        let requestBody: any = {};
        let uploadedCardImage: File | null = null;
        let uploadedBannerImage: File | null = null;
        let uploadedScreenshots: File[] = [];
        
        // Deletion flags
        let deleteCardImage = false;
        let deleteBannerImage = false;
        let deleteScreenshots = false;

        if (contentType?.includes('multipart/form-data')) {
            const formData = await request.formData();
            
            // Check for deletion flags
            deleteCardImage = formData.get('deleteCardImage') === 'true';
            deleteBannerImage = formData.get('deleteBannerImage') === 'true';
            deleteScreenshots = formData.get('deleteScreenshots') === 'true';
            
            // Extract card image (only if not deleting)
            if (!deleteCardImage) {
                const cardImageEntry = formData.get('cardImage');
                if (cardImageEntry && cardImageEntry instanceof File) {
                    uploadedCardImage = cardImageEntry;
                    
                    const fileValidation = validateFile(uploadedCardImage);
                    if (!fileValidation.valid) {
                        return buildErrorResponse(
                            unsuccessMessage,
                            generateAndFormatZodError("cardImage", fileValidation.error!),
                            HttpStatusCode.BAD_REQUEST_400,
                        );
                    }
                }
            }
            
            // Extract banner image (only if not deleting)
            if (!deleteBannerImage) {
                const bannerImageEntry = formData.get('bannerImage');
                if (bannerImageEntry && bannerImageEntry instanceof File) {
                    uploadedBannerImage = bannerImageEntry;
                    
                    const fileValidation = validateFile(uploadedBannerImage);
                    if (!fileValidation.valid) {
                        return buildErrorResponse(
                            unsuccessMessage,
                            generateAndFormatZodError("bannerImage", fileValidation.error!),
                            HttpStatusCode.BAD_REQUEST_400,
                        );
                    }
                }
            }
            
            // Extract screenshots (only if not deleting all)
            if (!deleteScreenshots) {
                const screenshotEntries = formData.getAll('screenshots');
                for (const entry of screenshotEntries) {
                    if (entry instanceof File) {
                        uploadedScreenshots.push(entry);
                    }
                }
                
                // Validate screenshots
                if (uploadedScreenshots.length > MAX_SCREENSHOTS) {
                    return buildErrorResponse(
                        unsuccessMessage,
                        generateAndFormatZodError("screenshots", `Maximum ${MAX_SCREENSHOTS} screenshots allowed`),
                        HttpStatusCode.BAD_REQUEST_400,
                    );
                }
                
                // Validate each screenshot
                for (let i = 0; i < uploadedScreenshots.length; i++) {
                    const fileValidation = validateFile(uploadedScreenshots[i]);
                    if (!fileValidation.valid) {
                        return buildErrorResponse(
                            unsuccessMessage,
                            generateAndFormatZodError("screenshots", `Screenshot ${i + 1}: ${fileValidation.error}`),
                            HttpStatusCode.BAD_REQUEST_400,
                        );
                    }
                }
            }
            
            // Extract other form fields
            for (const [key, value] of formData.entries()) {
                if (!['cardImage', 'bannerImage', 'screenshots', 'deleteCardImage', 'deleteBannerImage', 'deleteScreenshots'].includes(key)) {
                    requestBody[key] = value;
                }
            }
        } else {
            // Handle JSON requests
            const jsonBody = await request.json();
            requestBody = jsonBody;
            
            // Check for deletion flags in JSON
            deleteCardImage = jsonBody.deleteCardImage === true;
            deleteBannerImage = jsonBody.deleteBannerImage === true;
            deleteScreenshots = jsonBody.deleteScreenshots === true;
            
            // Remove deletion flags from validation
            delete requestBody.deleteCardImage;
            delete requestBody.deleteBannerImage;
            delete requestBody.deleteScreenshots;
        }

        // Validate the request body against schema (excluding image fields and deletion flags)
        const validationResult = editAppFormSchema.safeParse(requestBody);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const validatedData = validationResult.data;

        // Get associated projects to check permissions
        const associatedProjects = await getAssociatedProjectsOfApp(appId);
        
        if (!associatedProjects || associatedProjects.length === 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Associated project not found"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const projectId = associatedProjects[0].project.id;

        // Fetch the complete project data with members and partners
        const projectWithMembersAndPartners = await getOneAssociatedProject(projectId);
        
        if (!projectWithMembersAndPartners) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Project data not found"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // Check for Project Role
        const { canEdit } = checkProjectRole(user.id, projectWithMembersAndPartners, user.type);
        
        if (!canEdit) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Unauthorized to edit this app"
                ),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        // Handle file uploads, replacements, and deletions
        let newCardImagePath: string | undefined | null = undefined;
        let newBannerImagePath: string | undefined | null = undefined;
        let newScreenshotPaths: string[] = [];
        
        try {
            // Handle card image
            if (deleteCardImage) {
                // Delete existing card image
                if (app.cardImage) {
                    await deleteOldFile(app.cardImage);
                }
                newCardImagePath = null; // Set to null to remove from database
            } else if (uploadedCardImage) {
                // Replace existing card image
                if (app.cardImage) {
                    await deleteOldFile(app.cardImage);
                }
                newCardImagePath = await saveUploadedFile(uploadedCardImage, appId, 'image');
            }
            
            // Handle banner image
            if (deleteBannerImage) {
                // Delete existing banner image
                if (app.bannerImage) {
                    await deleteOldFile(app.bannerImage);
                }
                newBannerImagePath = null; // Set to null to remove from database
            } else if (uploadedBannerImage) {
                // Replace existing banner image
                if (app.bannerImage) {
                    await deleteOldFile(app.bannerImage);
                }
                newBannerImagePath = await saveUploadedFile(uploadedBannerImage, appId, 'image');
            }
            
            // Handle screenshots
            if (deleteScreenshots) {
                // Delete all existing screenshots
                await deleteExistingScreenshots(appId);
            } else if (uploadedScreenshots.length > 0) {
                // Replace all screenshots
                await deleteExistingScreenshots(appId);
                newScreenshotPaths = await processScreenshots(uploadedScreenshots, appId);
            }
            
        } catch (fileError: any) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("files", `File operation failed: ${fileError.message}`),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        // Prepare update data
        const updateData = Object.fromEntries(
            Object.entries(validatedData).filter(([_, value]) => 
                value !== undefined && value !== null
            )
        );

        // Add image paths based on operations performed
        if (newCardImagePath !== undefined) {
            updateData.cardImage = newCardImagePath;
        }
        
        if (newBannerImagePath !== undefined) {
            updateData.bannerImage = newBannerImagePath;
        }

        // Check if there's actual data to update
        const hasDataUpdate = Object.keys(updateData).length > 0;
        const hasScreenshotUpdate = newScreenshotPaths.length > 0 || deleteScreenshots;
        
        if (!hasDataUpdate && !hasScreenshotUpdate) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "No valid data provided for update"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Edit app (only if there's data to update)
        let result: any = { updateSuccess: true, updatedApp: app };
        
        if (hasDataUpdate) {
            result = await editAppById(appId, updateData);
            
            if (!result.updateSuccess || !result.updatedApp) {
                // If update failed and we uploaded new files, clean them up
                if (newCardImagePath && typeof newCardImagePath === 'string') {
                    await deleteOldFile(newCardImagePath);
                }
                if (newBannerImagePath && typeof newBannerImagePath === 'string') {
                    await deleteOldFile(newBannerImagePath);
                }
                for (const screenshotPath of newScreenshotPaths) {
                    await deleteOldFile(screenshotPath);
                }
                
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError("unknown", result.error || "Failed to update app in database"),
                    HttpStatusCode.INTERNAL_SERVER_ERROR_500,
                );
            }
        }
        
        // Insert screenshots if any were uploaded
        if (newScreenshotPaths.length > 0) {
            try {
                await insertScreenshots(appId, newScreenshotPaths);
            } catch (screenshotError: any) {
                console.error("Failed to insert screenshots:", screenshotError);
                // Screenshots insertion failed, but app update succeeded
                // You might want to handle this case differently based on your requirements
            }
        }
        
        // Create and return success response
        const successResponse = buildSuccessResponse(successMessage, {
            updateSuccess: result.updateSuccess,
            updatedApp: result.updatedApp,
            operations: {
                card_image: deleteCardImage ? 'deleted' : (uploadedCardImage ? 'uploaded' : 'unchanged'),
                banner_image: deleteBannerImage ? 'deleted' : (uploadedBannerImage ? 'uploaded' : 'unchanged'),
                screenshots: deleteScreenshots ? 'deleted' : (newScreenshotPaths.length > 0 ? `uploaded_${newScreenshotPaths.length}` : 'unchanged'),
            },
        });
        
        return successResponse;

    } catch (error: any) {
        return buildErrorResponse(
            unsuccessMessage,
            generateAndFormatZodError("unknown", `Server error: ${error.message}`),
            HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        );
    }
}
