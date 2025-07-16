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
export async function getAppScreenshots(
    appId: number,
): Promise<AppScreenshot[]> {
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

export async function deleteAppScreenshotById(id: number) {
    try {
        const result = await db
            .delete(appScreenshots)
            .where(eq(appScreenshots.id, id));
        return result;
    } catch (error) {
        console.error("Error deleting screenshot by ID:", error);
        throw error;
    }
}

export async function updateAppScreenshot(
    id: number,
    data: Partial<typeof appScreenshots.$inferInsert>,
) {
    try {
        const result = await db
            .update(appScreenshots)
            .set({
                ...data,
                updatedAt: new Date(), // Ensure updatedAt is set
            })
            .where(eq(appScreenshots.id, id));
        return result;
    } catch (error) {
        console.error("Error updating screenshot:", error);
        throw error;
    }
}

export async function updateScreenshotSortOrder(id: number, sortOrder: number) {
    try {
        const result = await db
            .update(appScreenshots)
            .set({
                sortOrder,
                updatedAt: new Date(),
            })
            .where(eq(appScreenshots.id, id));
        return result;
    } catch (error) {
        console.error("Error updating screenshot sort order:", error);
        throw error;
    }
}

// Get single screenshot by ID (useful for validation)
export async function getAppScreenshotById(id: number) {
    try {
        const result = await db
            .select()
            .from(appScreenshots)
            .where(eq(appScreenshots.id, id))
            .limit(1);
        return result[0] || null;
    } catch (error) {
        console.error("Error getting screenshot by ID:", error);
        throw error;
    }
}

// Get screenshots by app ID with specific ordering
export async function getAppScreenshotsOrdered(appId: number) {
    try {
        const result = await db
            .select()
            .from(appScreenshots)
            .where(eq(appScreenshots.appId, appId))
            .orderBy(appScreenshots.sortOrder);
        return result;
    } catch (error) {
        console.error("Error getting ordered screenshots:", error);
        throw error;
    }
}

// Update multiple screenshots' sort orders in a transaction
export async function updateMultipleScreenshotSortOrders(
    updates: { id: number; sortOrder: number }[],
) {
    try {
        const result = await db.transaction(async (tx) => {
            const promises = updates.map(({ id, sortOrder }) =>
                tx
                    .update(appScreenshots)
                    .set({
                        sortOrder,
                        updatedAt: new Date(),
                    })
                    .where(eq(appScreenshots.id, id)),
            );
            return await Promise.all(promises);
        });
        return result;
    } catch (error) {
        console.error("Error updating multiple screenshot sort orders:", error);
        throw error;
    }
}
