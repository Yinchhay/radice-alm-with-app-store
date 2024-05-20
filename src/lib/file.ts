import { User } from "lucia";
import path from "path";
import { localDebug } from "./utils";
import { fetchErrorSomethingWentWrong, ResponseJson } from "./response";
import { FetchFileStore } from "@/app/api/internal/file/store/route";
import { getBaseUrl } from "./server_utils";

// limit file size to 100MB
const KB = 1024;
const MB = KB * KB;
export const MAX_FILE_SIZE = 100 * MB;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function readableFileSize(bytes: number): string {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ["B", "kB", "MB", "GB", "TB"];
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

// Either get the file storage path from the environment variable or use the default path
export function getFileStoragePath(): string {
    if (process.env.FILE_STORAGE_PATH) {
        return process.env.FILE_STORAGE_PATH;
    }

    return `${path.join(process.cwd(), `/src/file_storage`)}`;
}

export async function uploadFiles(
    files: File[],
    sessionId: string,
): ResponseJson<FetchFileStore> {
    try {
        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }

        const response = await fetch(`${await getBaseUrl()}/api/internal/file/store`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to upload file");
        }
        return await response.json();
    } catch (error) {
        return fetchErrorSomethingWentWrong;
    }
}

export function fileToUrl(file: string | null | undefined): string {
    return `/api/file?filename=${file}`;
}