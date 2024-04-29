import path from "path";

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
