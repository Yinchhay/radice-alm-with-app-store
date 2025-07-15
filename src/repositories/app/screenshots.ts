import { getAssociatedProjectsOfApp, getAppById } from "./internal";
import { getOneAssociatedProject} from "../project";
import { checkProjectRole } from "@/lib/project";
import { validateFile, saveUploadedFile, deleteOldFile } from "./images";

export async function validateAppPermissions(appId: number, userId: string, userType: string) {
    const app = await getAppById(appId);
    if (!app) {
        throw new Error("App does not exist");
    }

    const associatedProjects = await getAssociatedProjectsOfApp(appId);
    if (!associatedProjects || associatedProjects.length === 0) {
        throw new Error("Associated project not found");
    }

    const projectId = associatedProjects[0].project.id;
    const projectWithMembersAndPartners = await getOneAssociatedProject(projectId);
    
    if (!projectWithMembersAndPartners) {
        throw new Error("Project data not found");
    }

    const { canEdit } = checkProjectRole(userId, projectWithMembersAndPartners, userType);
    if (!canEdit) {
        throw new Error("Unauthorized to edit this app");
    }

    return app;
}
export async function processScreenshots(screenshots: File[], appId: number, startIndex: number = 0): Promise<string[]> {
    const screenshotPaths: string[] = [];
    
    for (let i = 0; i < screenshots.length; i++) {
        const screenshot = screenshots[i];
        const validation = validateFile(screenshot);
        
        if (!validation.valid) {
            throw new Error(`Screenshot ${i + 1}: ${validation.error}`);
        }
        
        const uniqueIndex = startIndex + i;
        const screenshotPath = await saveUploadedFile(screenshot, appId, uniqueIndex.toString());
        screenshotPaths.push(screenshotPath);
    }
    
    return screenshotPaths;
}

export async function insertScreenshots(appId: number, screenshotPaths: string[]) {
    const { insertAppScreenshots } = await import("@/repositories/app_screenshot");
    
    const screenshots = screenshotPaths.map((path, index) => ({
        appId,
        imageUrl: path,
        sortOrder: index + 1,
    }));
    
    return await insertAppScreenshots(screenshots);
}

export async function deleteExistingScreenshots(appId: number) {
    const { deleteAppScreenshots, getAppScreenshots } = await import("@/repositories/app_screenshot");
    
    const existingScreenshots = await getAppScreenshots(appId);
    
    if (existingScreenshots && existingScreenshots.length > 0) {
        for (const screenshot of existingScreenshots) {
            if (screenshot.imageUrl) {
                await deleteOldFile(screenshot.imageUrl);
            }
        }
    }
    
    return await deleteAppScreenshots(appId);
}

export async function reorderScreenshots(appId: number) {
    const { getAppScreenshotsOrdered, updateMultipleScreenshotSortOrders } = await import("@/repositories/app_screenshot");
    
    const screenshots = await getAppScreenshotsOrdered(appId);
    if (!screenshots || screenshots.length === 0) return;
    
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
    
    if (updates.length > 0) {
        await updateMultipleScreenshotSortOrders(updates);
    }
}