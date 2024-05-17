import { getFileStoragePath } from "@/lib/file";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import fs from "fs";
import { deleteFileByFilename, getFileByFilename } from "@/repositories/files";
import {
    buildErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { getAuthUser } from "@/auth/lucia";
import { checkBearerAndPermission } from "@/lib/IAM";
import { z } from "zod";
import { deleteFileFormSchema } from "../schema";
import {
    checkProjectRole,
    ProjectJoinMembers,
    ProjectRole,
} from "@/lib/project";
import { UserType } from "@/types/user";

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

        const body: z.infer<typeof deleteFileFormSchema> = await request.json();
        const validationResult = deleteFileFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const filename = body.filename;
        const savePath = getFileStoragePath();
        const fileAbsPath = `${savePath}/${filename}`;

        if (!fs.existsSync(fileAbsPath)) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "File not found!"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const fileDetail = await getFileByFilename(filename);
        if (!fileDetail) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "File not found!!"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // check permission to access the file only if the file is in a project
        if (fileDetail.project) {
            const { canEdit } = checkProjectRole(
                user.id,
                fileDetail.project as ProjectJoinMembers,
                user.type,
            );

            if (canEdit) {
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError(
                        "unknown",
                        "Unauthorized to delete the file!!",
                    ),
                    HttpStatusCode.UNAUTHORIZED_401,
                );
            }
        } else {
            // if the file is not in a project, check by comparing who uploaded the file
            if (fileDetail.userId !== user.id && user.type !== UserType.SUPER_ADMIN) {
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
        // if no row is affected, meaning that the category didn't get deleted
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", unsuccessMessage),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }

        await fs.promises.unlink(fileAbsPath);

        return buildSuccessResponse<FetchDeleteFile>(successMessage, {});
    } catch (error) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
