import { NextRequest } from "next/server";
import fs from "fs";
import { HttpStatusCode } from "@/types/http";
import { getFileStoragePath } from "@/lib/file";
import { getAuthUser } from "@/auth/lucia";
import { checkBearerAndPermission } from "@/lib/IAM";
import { getFileByFilename } from "@/repositories/files";
import {
    checkProjectRole,
    ProjectJoinMembers,
    ProjectRole,
} from "@/lib/project";

export async function GET(request: NextRequest) {
    try {
        const filename = request.nextUrl.searchParams.get("filename");
        if (!filename) {
            return new Response("Filename is required", {
                status: HttpStatusCode.BAD_REQUEST_400,
            });
        }

        const savePath = getFileStoragePath();
        const fileAbsPath = `${savePath}/${filename}`;

        if (!fs.existsSync(fileAbsPath)) {
            return new Response("File not found!", {
                status: HttpStatusCode.NOT_FOUND_404,
            });
        }

        const fileDetail = await getFileByFilename(filename);
        if (!fileDetail) {
            return new Response("File not found!!", {
                status: HttpStatusCode.NOT_FOUND_404,
            });
        }

        // check permission to access the file only if the file is in a project
        // we do not check by who uploaded the file, because there might be a case where the file is uploaded by a someone in the project but then the person is removed from the project
        if (fileDetail.project) {
            // check by user's cookie, if failed, check by bearer token
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

            const userRoleInProject = checkProjectRole(
                authUser.id,
                fileDetail.project as ProjectJoinMembers,
            );

            if (
                userRoleInProject !== ProjectRole.MEMBER &&
                userRoleInProject !== ProjectRole.OWNER
            ) {
                return new Response("Unauthorized to access the file!!", {
                    status: HttpStatusCode.UNAUTHORIZED_401,
                });
            }
        }

        const file = await fs.promises.readFile(fileAbsPath);

        return new Response(file, {
            status: HttpStatusCode.OK_200,
        });
    } catch (error) {
        return new Response("Failed to read file", {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        });
    }
}
