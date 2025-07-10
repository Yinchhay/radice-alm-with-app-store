import { getAssociatedProjectsOfApp, getAppById } from "./internal";
import { getOneAssociatedProject} from "../project";
import { checkProjectRole } from "@/lib/project";
import { validateFile, saveUploadedFile, deleteOldFile } from "./images";


// Helper function to validate permissions


export async function validateAppPermissions(appId: number, userId: string, userType: string) {
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
    const projectWithMembersAndPartners = await getOneAssociatedProject(projectId);
    
    if (!projectWithMembersAndPartners) {
        throw new Error("Project data not found");
    }

    // Check for Project Role
    const { canEdit } = checkProjectRole(userId, projectWithMembersAndPartners, userType);
    if (!canEdit) {
        throw new Error("Unauthorized to edit this app");
    }

    return app;
}

// Helper function to process screenshots
export async function processScreenshots(screenshots: File[], appId: number, startIndex: number = 0): Promise<string[]> {
    const screenshotPaths: string[] = [];
    
    for (let i = 0; i < screenshots.length; i++) {
        const screenshot = screenshots[i];
        const validation = validateFile(screenshot);
        
        if (!validation.valid) {
            throw new Error(`Screenshot ${i + 1}: ${validation.error}`);
        }
        
        // Convert uniqueIndex to string for the imageType parameter
        const uniqueIndex = startIndex + i;
        const screenshotPath = await saveUploadedFile(screenshot, appId, uniqueIndex.toString());
        screenshotPaths.push(screenshotPath);
    }
    
    return screenshotPaths;
}

// Helper function to insert screenshots into database
export async function insertScreenshots(appId: number, screenshotPaths: string[]) {
    const { insertAppScreenshots } = await import("@/repositories/app_screenshot");
    
    const screenshots = screenshotPaths.map((path, index) => ({
        appId,
        imageUrl: path,
        sortOrder: index + 1,
    }));
    
    return await insertAppScreenshots(screenshots);
}

// Helper function to delete existing screenshots
export async function deleteExistingScreenshots(appId: number) {
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

// Helper function to reorder screenshots after deletion/update
export async function reorderScreenshots(appId: number) {
    const { getAppScreenshotsOrdered, updateMultipleScreenshotSortOrders } = await import("@/repositories/app_screenshot");
    
    const screenshots = await getAppScreenshotsOrdered(appId);
    if (!screenshots || screenshots.length === 0) return;
    
    // Prepare updates for screenshots that need reordering
    const updates: { id: number, sortOrder: number }[] = [];
    
    for (let i = 0; i < screenshots.length; i++) {
        const newSortOrder = i + 1;
        if (screenshots[i].sortOrder !== newSortOrder) {
            updates.push({
                id: screenshots[i].id,
                sortOrder: newSortOrder
            });
        }
    }
    
    // Batch update if there are changes needed
    if (updates.length > 0) {
        await updateMultipleScreenshotSortOrders(updates);
    }
}