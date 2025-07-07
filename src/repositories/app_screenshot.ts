import { db } from "@/drizzle/db";
import { appScreenshots } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export interface AppScreenshot {
    id: number;
    appId: number | null;
    imageUrl: string | null;
    sortOrder: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface CreateAppScreenshot {
    appId: number;
    imageUrl: string;
    sortOrder: number;
}

/**
 * Insert multiple screenshots for an app
 */
export async function insertAppScreenshots(screenshots: CreateAppScreenshot[]) {
    try {
        const result = await db.insert(appScreenshots).values(screenshots);
        return {
            success: true,
            insertedCount: screenshots.length,
            data: result,
        };
    } catch (error: any) {
        console.error("Error inserting app screenshots:", error);
        return {
            success: false,
            error: error.message || "Failed to insert screenshots",
            insertedCount: 0,
        };
    }
}

/**
 * Get all screenshots for a specific app
 */
export async function getAppScreenshots(appId: number): Promise<AppScreenshot[]> {
    try {
        const screenshots = await db
            .select()
            .from(appScreenshots)
            .where(eq(appScreenshots.appId, appId))
            .orderBy(appScreenshots.sortOrder);
        
        return screenshots as AppScreenshot[];
    } catch (error: any) {
        console.error("Error fetching app screenshots:", error);
        return [];
    }
}

/**
 * Get a specific screenshot by ID
 */
export async function getScreenshotById(screenshotId: number): Promise<AppScreenshot | null> {
    try {
        const screenshot = await db
            .select()
            .from(appScreenshots)
            .where(eq(appScreenshots.id, screenshotId))
            .limit(1);
        
        return (screenshot[0] as AppScreenshot) || null;
    } catch (error: any) {
        console.error("Error fetching screenshot by ID:", error);
        return null;
    }
}

/**
 * Delete all screenshots for a specific app
 */
export async function deleteAppScreenshots(appId: number) {
    try {
        const result = await db
            .delete(appScreenshots)
            .where(eq(appScreenshots.appId, appId));
        
        return {
            success: true,
            deletedCount: result.rowsAffected || 0,
        };
    } catch (error: any) {
        console.error("Error deleting app screenshots:", error);
        return {
            success: false,
            error: error.message || "Failed to delete screenshots",
            deletedCount: 0,
        };
    }
}

/**
 * Delete a specific screenshot by ID
 */
export async function deleteScreenshotById(screenshotId: number) {
    try {
        const result = await db
            .delete(appScreenshots)
            .where(eq(appScreenshots.id, screenshotId));
        
        return {
            success: true,
            deletedCount: result.rowsAffected || 0,
        };
    } catch (error: any) {
        console.error("Error deleting screenshot:", error);
        return {
            success: false,
            error: error.message || "Failed to delete screenshot",
            deletedCount: 0,
        };
    }
}

/**
 * Update screenshot sort order
 */
export async function updateScreenshotSortOrder(screenshotId: number, newSortOrder: number) {
    try {
        const result = await db
            .update(appScreenshots)
            .set({ 
                sortOrder: newSortOrder,
                updatedAt: new Date()
            })
            .where(eq(appScreenshots.id, screenshotId));
        
        return {
            success: true,
            updated: (result.rowsAffected || 0) > 0,
        };
    } catch (error: any) {
        console.error("Error updating screenshot sort order:", error);
        return {
            success: false,
            error: error.message || "Failed to update screenshot sort order",
            updated: false,
        };
    }
}

/**
 * Replace all screenshots for an app (delete old ones and insert new ones)
 */
export async function replaceAppScreenshots(appId: number, newScreenshots: CreateAppScreenshot[]) {
    try {
        // Start a transaction to ensure atomicity
        await db.transaction(async (tx) => {
            // Delete existing screenshots
            await tx.delete(appScreenshots).where(eq(appScreenshots.appId, appId));
            
            // Insert new screenshots if any
            if (newScreenshots.length > 0) {
                await tx.insert(appScreenshots).values(newScreenshots);
            }
        });
        
        return {
            success: true,
            replacedCount: newScreenshots.length,
        };
    } catch (error: any) {
        console.error("Error replacing app screenshots:", error);
        return {
            success: false,
            error: error.message || "Failed to replace screenshots",
            replacedCount: 0,
        };
    }
}

/**
 * Get screenshot count for an app
 */
export async function getAppScreenshotCount(appId: number): Promise<number> {
    try {
        const result = await db
            .select()
            .from(appScreenshots)
            .where(eq(appScreenshots.appId, appId));
        
        return result.length;
    } catch (error: any) {
        console.error("Error getting screenshot count:", error);
        return 0;
    }
}

/**
 * Update screenshot image URL
 */
export async function updateScreenshotImageUrl(screenshotId: number, newImageUrl: string) {
    try {
        const result = await db
            .update(appScreenshots)
            .set({ 
                imageUrl: newImageUrl,
                updatedAt: new Date()
            })
            .where(eq(appScreenshots.id, screenshotId));
        
        return {
            success: true,
            updated: (result.rowsAffected || 0) > 0,
        };
    } catch (error: any) {
        console.error("Error updating screenshot image URL:", error);
        return {
            success: false,
            error: error.message || "Failed to update screenshot image URL",
            updated: false,
        };
    }
}