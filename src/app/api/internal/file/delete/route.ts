import { getFileStoragePath } from "@/lib/file";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import fs from "fs";
import { deleteFileByFilename, getFileByFilename } from "@/repositories/files";
import {
    buildErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission, hasPermission } from "@/lib/IAM";
import { z } from "zod";
import { deleteFileFormSchema } from "../schema";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import { UserType } from "@/types/user";
import { Permissions } from "@/types/IAM";
import { FileBelongTo } from "@/drizzle/schema";
import { localDebug } from "@/lib/utils";

const successMessage = "Delete file successfully";
const unsuccessMessage = "Delete file failed";

export type FetchDeleteFile = Record<string, never>;

export async function DELETE(request: NextRequest) {
    try {
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken || errorNoPermission) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Unauthorized to delete the file!!",
                ),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        let body: z.infer<typeof deleteFileFormSchema> = await request.json();
        const validationResult = deleteFileFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const filename = body.filename;
        const savePath = getFileStoragePath();
        const fileAbsPath = `${savePath}/${filename}`;

        const fileDetail = await getFileByFilename(filename);
        if (!fileDetail) {
            return buildSuccessResponse<FetchDeleteFile>(
                "File not found in database",
                {},
            );
        }

        if (!fs.existsSync(fileAbsPath)) {
            // event though the file is in the database, but it's not in the storage, consider removing it from the database
            const deleteResult = await deleteFileByFilename(filename);
            // intentionally return success response here.
            return buildSuccessResponse<FetchDeleteFile>(
                "File not found in storage",
                {},
            );
        }

        if (fileDetail) {
            let canDelete = false;
            let requiredPermission: Set<Permissions> = new Set([]);
            switch (fileDetail.belongTo) {
                case FileBelongTo.Media:
                    requiredPermission.add(Permissions.DELETE_MEDIA);
                    requiredPermission.add(Permissions.EDIT_MEDIA);
                    break;
                case FileBelongTo.ApplicationForm:
                    requiredPermission.add(
                        Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS,
                    );
                    break;
                case FileBelongTo.Category:
                    requiredPermission.add(Permissions.DELETE_CATEGORIES);
                    requiredPermission.add(Permissions.EDIT_CATEGORIES);
                    break;
                case FileBelongTo.ContentBuilder:
                    if (fileDetail.project) {
                        canDelete = checkProjectRole(
                            user.id,
                            fileDetail.project,
                            user.type,
                        ).canEdit;
                    }

                    break;
                case FileBelongTo.ProjectSetting:
                    if (fileDetail.project) {
                        const { projectRole } = checkProjectRole(
                            user.id,
                            fileDetail.project,
                            user.type,
                        );
                        canDelete =
                            projectRole === ProjectRole.OWNER ||
                            projectRole === ProjectRole.SUPER_ADMIN;
                    }
                    break;
                case FileBelongTo.User:
                    canDelete = user.id === fileDetail.userId;
                    break;
                default:
                    canDelete = false;
                    break;
            }

            if (requiredPermission.size > 0) {
                canDelete = (await hasPermission(user.id, requiredPermission))
                    .canAccess;
            }

            const isSuperAdmin = user.type === UserType.SUPER_ADMIN;
            if (!isSuperAdmin && !canDelete) {
                localDebug(
                    `Not authorized to delete the file. File belong to ${fileDetail.belongTo}, isSuperAdmin ${isSuperAdmin}, canDelete ${canDelete}`,
                    "/api/internal/file/delete/route.ts DELETE()",
                );

                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError(
                        "unknown",
                        "Unauthorized to delete the file!!",
                    ),
                    HttpStatusCode.UNAUTHORIZED_401,
                );
            }
        }

        const deleteResult = await deleteFileByFilename(filename);
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", unsuccessMessage),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        // delete the file from the storage
        await fs.promises.unlink(fileAbsPath);

        return buildSuccessResponse<FetchDeleteFile>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
