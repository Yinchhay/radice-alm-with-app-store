import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import fs from "fs";
import path from "path";
import { createFileFormSchema } from "../../internal/file/schema";
import { formatZodError } from "@/lib/form";
import { createFile } from "@/repositories/files";
import { ErrorMessage } from "@/types/error";

import { getFileStoragePath, readableFileSize } from "@/lib/file";
import { z } from "zod";
import { FileBelongTo } from "@/drizzle/schema";

const successMessage = "File uploaded successfully";
const unsuccessMessage = "Failed to upload file";

export type FetchFileStore = {
    filenames: string[];
};

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([]);
        const { user } = await checkBearerAndPermission(
            request,
            requiredPermission,
        );

        const formData = await request.formData();
        let data: z.infer<typeof createFileFormSchema> = {
            files: formData.getAll("files") as File[],
            projectId: Number(formData.get("projectId")) || null,
            belongTo: (formData.get("belongTo") as FileBelongTo) || null,
        };

        const validationResult = createFileFormSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        data = validationResult.data as typeof data;

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
                userId: user?.id,
                filename: filename,
                size: readableFileSize(file.size),
                projectId: data.projectId,
                belongTo: data.belongTo,
            });

            // if no row is affected, meaning that creating file failed
            if (createFileResult[0].affectedRows < 1) {
                // remove the savedFile
                await fs.promises.unlink(savePathAndFileName);
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
