import path from "path";
import { fetchErrorSomethingWentWrong, ResponseJson } from "./response";
import { FetchFileStore } from "@/app/api/file/store/route";
import { getBaseUrl } from "./server_utils";
import { FileBelongTo } from "@/drizzle/schema";

// limit file size to 100MB
const KB = 1024;
const MB = KB * KB;
export const MAX_FILE_SIZE = 100 * MB;
export const CV_MAX_FILE_SIZE = 10 * MB;
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
export const ACCEPTED_CV_TYPES = ["application/pdf", "application/msword"];

export function readableFileSize(bytes: number): string {
    if (bytes < 1) {
        return "0 B";
    }

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
    {
        sessionId = "",
        projectId,
        belongTo,
    }: {
        sessionId?: string;
        projectId?: number;
        belongTo?: FileBelongTo;
    },
): ResponseJson<FetchFileStore> {
    try {
        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }
        if (projectId) {
            formData.append("projectId", projectId as unknown as string);
        }
        if (belongTo) {
            formData.append("belongTo", belongTo as unknown as string);
        }

        const response = await fetch(`${await getBaseUrl()}/api/file/store`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });

        return await response.json();
    } catch (error) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function deleteFile(
    filename: string,
    sessionId: string,
): ResponseJson<FetchFileStore> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/file/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify({ filename }),
            },
        );

        return await response.json();
    } catch (error) {
        return fetchErrorSomethingWentWrong;
    }
}

export function fileToUrl(file: string | null | undefined): string {
    if (!file) {
        return "/placeholder.webp";
    }

    const fileStartsWith = ["http", "/", "blob:"];
    if (fileStartsWith.some((fsw) => file.startsWith(fsw))) {
        return file;
    }

    return `/api/file?filename=${file}`;
}
