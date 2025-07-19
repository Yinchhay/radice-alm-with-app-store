import { promises as fs } from "fs";
import path from "path";

const IMAGE_STORAGE_PATH = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15Mb
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_SCREENSHOTS = 8;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

const ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/mov",
    "video/quicktime",
];

export async function ensureUploadDir() {
    try {
        await fs.access(IMAGE_STORAGE_PATH);
    } catch {
        await fs.mkdir(IMAGE_STORAGE_PATH, { recursive: true });
    }
}

export async function deleteOldFile(filePath: string) {
    if (!filePath) return;

    try {
        const filename = path.basename(filePath);
        const fullPath = path.join(IMAGE_STORAGE_PATH, filename);

        await fs.access(fullPath);
        await fs.unlink(fullPath);
        console.log(`Deleted old file: ${fullPath}`);
    } catch (error) {
        console.warn(`Could not delete old file: ${filePath}`, error);
    }
}

export async function saveUploadedFile(
    file: File,
    appId: number,
    fileType: string,
): Promise<string> {
    await ensureUploadDir();

    const fileExtension = path.extname(file.name);
    const timestamp = Date.now();
    const uniqueFilename = `app_${appId}_${fileType}_${timestamp}${fileExtension}`;
    const filePath = path.join(IMAGE_STORAGE_PATH, uniqueFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return `/uploads/${uniqueFilename}`;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        };
    }

    return { valid: true };
}

export function validateVideoFile(file: File): {
    valid: boolean;
    error?: string;
} {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid video type. Allowed types: ${ALLOWED_VIDEO_TYPES.join(", ")}`,
        };
    }

    if (file.size > MAX_VIDEO_SIZE) {
        return {
            valid: false,
            error: `Video size too large. Maximum size: ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`,
        };
    }

    return { valid: true };
}

export function getFileInfo(file: File) {
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
    };
}

export async function copyImageFile(
    originalPath: string,
    newAppId: number,
    imageType: "card" | "banner",
): Promise<string | null> {
    if (!originalPath) return null;

    try {
        const originalFilename = path.basename(originalPath);
        const fileExtension = path.extname(originalFilename);
        const timestamp = Date.now();

        const newFilename = `app_${newAppId}_${imageType}_image_${timestamp}${fileExtension}`;
        const originalFullPath = path.join(IMAGE_STORAGE_PATH, originalFilename);
        const newFullPath = path.join(IMAGE_STORAGE_PATH, newFilename);

        await fs.access(originalFullPath);
        await fs.copyFile(originalFullPath, newFullPath);

        return `/uploads/${newFilename}`;
    } catch (error) {
        console.warn(`Failed to copy ${imageType} image:`, error);
        return null;
    }
}

export async function copyScreenshots(
    originalAppId: number,
    newAppId: number,
): Promise<void> {
    try {
        const { getAppScreenshots, insertAppScreenshots } = await import(
            "@/repositories/app_screenshot"
        );

        const originalScreenshots = await getAppScreenshots(originalAppId);

        if (!originalScreenshots || originalScreenshots.length === 0) {
            return;
        }

        const newScreenshots = [];

        for (let i = 0; i < originalScreenshots.length; i++) {
            const originalScreenshot = originalScreenshots[i];

            if (!originalScreenshot.imageUrl) continue;

            try {
                const originalFilename = path.basename(
                    originalScreenshot.imageUrl,
                );
                const fileExtension = path.extname(originalFilename);
                const timestamp = Date.now();

                const newFilename = `app_${newAppId}_${i}_${timestamp}${fileExtension}`;
                const originalFullPath = path.join(
                    IMAGE_STORAGE_PATH,
                    originalFilename,
                );
                const newFullPath = path.join(IMAGE_STORAGE_PATH, newFilename);

                await fs.access(originalFullPath);
                await fs.copyFile(originalFullPath, newFullPath);

                newScreenshots.push({
                    appId: newAppId,
                    imageUrl: `/uploads/${newFilename}`,
                    sortOrder: originalScreenshot.sortOrder || i + 1,
                });
            } catch (error) {
                console.warn(`Failed to copy screenshot ${i}:`, error);
            }
        }

        if (newScreenshots.length > 0) {
            await insertAppScreenshots(newScreenshots);
        }
    } catch (error) {
        console.error("Failed to copy screenshots:", error);
    }
}
