import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH || "./src/file_storage";

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } },
) {
    try {
        const filePath = params.path.join("/");

        // Handle the 'apps' subfolder - the path will be like ['apps', 'filename.png']
        const fullPath = path.join(FILE_STORAGE_PATH, filePath);

        // Security check - ensure file is within upload directory
        const normalizedPath = path.normalize(fullPath);
        const normalizedUploadPath = path.normalize(FILE_STORAGE_PATH);

        if (!normalizedPath.startsWith(normalizedUploadPath)) {
            console.error("Security violation: Path outside upload directory", {
                requested: normalizedPath,
                allowed: normalizedUploadPath,
            });
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Check if file exists
        try {
            await fs.access(fullPath);
        } catch (error) {
            console.error("File not found:", fullPath);
            return new NextResponse("File not found", { status: 404 });
        }

        // Read and return file
        const fileBuffer = await fs.readFile(fullPath);
        const fileExtension = path.extname(fullPath).toLowerCase();

        // Determine content type
        const contentTypeMap: { [key: string]: string } = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
        };

        const contentType =
            contentTypeMap[fileExtension] || "application/octet-stream";

        console.log("Serving file:", {
            path: filePath,
            fullPath,
            size: fileBuffer.length,
            contentType,
        });

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error serving file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
