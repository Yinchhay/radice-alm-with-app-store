import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { HttpStatusCode } from "@/types/http";
import { getFileStoragePath } from "@/lib/file";
import { getAuthUser } from "@/auth/lucia";
import { checkBearerAndPermission } from "@/lib/IAM";
import { getFileByFilename } from "@/repositories/files";
import { checkProjectRole, ProjectRole } from "@/lib/project";

function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.zip': 'application/zip',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

function getLegacyUploadsPath(): string {
    return path.join(process.cwd(), "public", "uploads");
}

export async function GET(request: NextRequest) {
    try {
        const filename = request.nextUrl.searchParams.get("filename");
        if (!filename) {
            return new Response("Filename is required", {
                status: HttpStatusCode.BAD_REQUEST_400,
            });
        }

        // Try new system (DB + getFileStoragePath)
        const savePath = getFileStoragePath();
        const fileAbsPath = path.join(savePath, filename);

        let fileDetail = await getFileByFilename(filename);
        let fileExists = fs.existsSync(fileAbsPath);

        // If not found in DB or on disk, try legacy path
        let legacyFileAbsPath = path.join(getLegacyUploadsPath(), filename);
        let legacyFileExists = fs.existsSync(legacyFileAbsPath);

        // If found in DB, enforce permission if needed
        if (fileDetail && fileExists) {
            if (fileDetail.project) {
                let authUser = await getAuthUser();
                if (!authUser) {
                    const requiredPermission = new Set([]);
                    const { errorNoBearerToken, errorNoPermission, user } =
                        await checkBearerAndPermission(request, requiredPermission);
                    if (errorNoBearerToken || errorNoPermission) {
                        return new Response("Unauthorized to access the file!!", {
                            status: HttpStatusCode.UNAUTHORIZED_401,
                        });
                    }
                    authUser = user;
                }
                const { projectRole } = checkProjectRole(
                    authUser.id,
                    fileDetail.project,
                    authUser.type,
                );
                if (projectRole === ProjectRole.NONE) {
                    return new Response("Unauthorized to access the file!!", {
                        status: HttpStatusCode.UNAUTHORIZED_401,
                    });
                }
            }
            // Serve file from new system
            const file = await fs.promises.readFile(fileAbsPath);
            const mimeType = getMimeType(filename);
            return new Response(file, {
                status: HttpStatusCode.OK_200,
                headers: {
                    "Content-Type": mimeType,
                    "Content-Disposition": `inline; filename=\"${filename}\"`,
                    "Cache-Control": "public, max-age=31536000",
                },
            });
        }

        // If not found in DB, but exists in legacy path, serve it (no permission check)
        if (!fileDetail && legacyFileExists) {
            const file = await fs.promises.readFile(legacyFileAbsPath);
            const mimeType = getMimeType(filename);
            return new Response(file, {
                status: HttpStatusCode.OK_200,
                headers: {
                    "Content-Type": mimeType,
                    "Content-Disposition": `inline; filename=\"${filename}\"`,
                    "Cache-Control": "public, max-age=31536000",
                },
            });
        }

        // If not found in either, return 404
        return new Response("File not found!", {
            status: HttpStatusCode.NOT_FOUND_404,
        });

    } catch (error) {
        console.error("[FILE API DEBUG] Error:", error);
        return new Response("Failed to read file", {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        });
    }
}