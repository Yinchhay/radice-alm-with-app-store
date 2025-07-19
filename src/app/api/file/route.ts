// import { NextRequest } from "next/server";
// import fs from "fs";
// import { HttpStatusCode } from "@/types/http";
// import { getFileStoragePath } from "@/lib/file";
// import { getAuthUser } from "@/auth/lucia";
// import { checkBearerAndPermission } from "@/lib/IAM";
// import { getFileByFilename } from "@/repositories/files";
// import { checkProjectRole, ProjectRole } from "@/lib/project";

// export async function GET(request: NextRequest) {
//     try {
//         const filename = request.nextUrl.searchParams.get("filename");
//         if (!filename) {
//             return new Response("Filename is required", {
//                 status: HttpStatusCode.BAD_REQUEST_400,
//             });
//         }

//         const savePath = getFileStoragePath();
//         const fileAbsPath = `${savePath}/${filename}`;

//         if (!fs.existsSync(fileAbsPath)) {
//             return new Response("File not found!", {
//                 status: HttpStatusCode.NOT_FOUND_404,
//             });
//         }

//         const fileDetail = await getFileByFilename(filename);
//         if (!fileDetail) {
//             return new Response("File not found!!", {
//                 status: HttpStatusCode.NOT_FOUND_404,
//             });
//         }

//         // check permission to access the file only if the file is in a project
//         // we do not check by who uploaded the file, because there might be a case where the file is uploaded by a someone in the project but then the person is removed from the project
//         if (fileDetail.project) {
//             // check by user's cookie, if failed, check by bearer token
//             let authUser = await getAuthUser();

//             if (!authUser) {
//                 const requiredPermission = new Set([]);
//                 const { errorNoBearerToken, errorNoPermission, user } =
//                     await checkBearerAndPermission(request, requiredPermission);
//                 if (errorNoBearerToken || errorNoPermission) {
//                     return new Response("Unauthorized to access the file!!", {
//                         status: HttpStatusCode.UNAUTHORIZED_401,
//                     });
//                 }

//                 authUser = user;
//             }

//             const { projectRole } = checkProjectRole(
//                 authUser.id,
//                 fileDetail.project,
//                 authUser.type,
//             );

//             if (projectRole === ProjectRole.NONE) {
//                 return new Response("Unauthorized to access the file!!", {
//                     status: HttpStatusCode.UNAUTHORIZED_401,
//                 });
//             }
//         }

//         const file = await fs.promises.readFile(fileAbsPath);

//         return new Response(file, {
//             status: HttpStatusCode.OK_200,
//             headers: {
//                 "Content-Type": "application/octet-stream",
//                 "Content-Disposition": `attachment; filename="${filename}"`,
//             },
//         });
//     } catch (error) {
//         return new Response("Failed to read file", {
//             status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
//         });
//     }
// }

import { NextRequest } from "next/server";
import fs from "fs";
import { HttpStatusCode } from "@/types/http";
import { getFileStoragePath } from "@/lib/file";
import { getAuthUser } from "@/auth/lucia";
import { checkBearerAndPermission } from "@/lib/IAM";
import { getFileByFilename } from "@/repositories/files";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import path from "path";


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

function getCorrectFileStoragePath(): string {
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

        const savePath = getCorrectFileStoragePath();
        const fileAbsPath = `${savePath}/${filename}`;

        console.log(`[FILE API DEBUG] Looking for file: ${fileAbsPath}`);

        if (!fs.existsSync(fileAbsPath)) {
            console.log(`[FILE API DEBUG] File not found: ${fileAbsPath}`);
            return new Response("File not found!", {
                status: HttpStatusCode.NOT_FOUND_404,
            });
        }

        const fileDetail = await getFileByFilename(filename);
        if (!fileDetail) {
            const file = await fs.promises.readFile(fileAbsPath);
            const mimeType = getMimeType(filename);

            return new Response(file, {
                status: HttpStatusCode.OK_200,
                headers: {
                    "Content-Type": mimeType,
                    "Content-Disposition": `inline; filename="${filename}"`,
                    "Cache-Control": "public, max-age=31536000", // Cache for 1 year
                },
            });
        }

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

        const file = await fs.promises.readFile(fileAbsPath);
        const mimeType = getMimeType(filename);


        return new Response(file, {
            status: HttpStatusCode.OK_200,
            headers: {
                "Content-Type": mimeType,
                "Content-Disposition": `inline; filename="${filename}"`,
                "Cache-Control": "public, max-age=31536000", // Cache for 1 year
            },
        });
    } catch (error) {
        console.error("[FILE API DEBUG] Error:", error);
        return new Response("Failed to read file", {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        });
    }
}
