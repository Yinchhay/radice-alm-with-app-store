import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import fs from "fs";
import path from "path";
import { createFileFormSchema } from "../schema";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { createFile } from "@/repositories/files";
import { ErrorMessage } from "@/types/error";

import { getFileStoragePath, readableFileSize } from "@/lib/file";
import { localDebug } from "@/lib/utils";

const successMessage = "File uploaded successfully";
const unsuccessMessage = "Failed to upload file";

export type FetchFileStore = {
    filenames: string[];
};

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const formData = await request.formData();
        const data = {
            files: formData.getAll("files") as File[],
            projectId: Number(formData.get("project_id")) || null,
        };

        const validationResult = createFileFormSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        let filenames: string[] = [];
        const savePath = getFileStoragePath();

        for (const file of data.files) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // create the directory if it doesn't exist
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath, { recursive: true });
            }

            // separate the file name and extension
            const fileExtension = path.extname(file.name);
            const tempFilename = path.basename(file.name, fileExtension);
            const filename = `${tempFilename}-${crypto.randomUUID()}${fileExtension}`;
            const savePathAndFileName = `${savePath}/${filename}`;

            await fs.promises.writeFile(savePathAndFileName, buffer);

            const createFileResult = await createFile({
                userId: user.id,
                filename: filename,
                size: readableFileSize(file.size),
                projectId: data.projectId,
            });

            // if no row is affected, meaning that creating file failed
            if (createFileResult[0].affectedRows < 1) {
                throw new Error(ErrorMessage.SomethingWentWrong);
            }

            filenames.push(filename);
        }

        return buildSuccessResponse<FetchFileStore>(successMessage, {
            filenames: filenames,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
