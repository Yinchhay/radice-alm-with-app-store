import { promises as fs } from "fs";
import path from "path";

// Configuration for file uploads
const FILE_STORAGE_PATH = path.join(
    process.cwd(),
    process.env.FILE_STORAGE_PATH || "./public/uploads/apps",
);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for images
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB for videos
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

// Helper function to ensure upload directory exists
export async function ensureUploadDir() {
    try {
        await fs.access(FILE_STORAGE_PATH);
    } catch {
        await fs.mkdir(FILE_STORAGE_PATH, { recursive: true });
    }
}

// Helper function to delete old file
export async function deleteOldFile(filePath: string) {
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
export async function saveUploadedFile(
    file: File,
    appId: number,
    fileType: string,
): Promise<string> {
    await ensureUploadDir();

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const timestamp = Date.now();
    const uniqueFilename = `app_${appId}_${fileType}_${timestamp}${fileExtension}`;
    const filePath = path.join(FILE_STORAGE_PATH, uniqueFilename);

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Return path for Next.js compatibility
    return `/uploads/apps/${uniqueFilename}`;
}

// Helper function to validate image files
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

// Helper function to validate video files
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

// Helper function to get file info
export function getFileInfo(file: File) {
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
    };
}
