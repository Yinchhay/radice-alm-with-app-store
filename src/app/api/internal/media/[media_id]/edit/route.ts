import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { editMediaById, getMediaById } from "@/repositories/media";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { editMediaSchema, existingMediaFilesSchema } from "../../schema";
import { lucia } from "@/auth/lucia";
import { deleteFile, uploadFiles } from "@/lib/file";
import { FileBelongTo, MediaFile } from "@/drizzle/schema";
import { findItemsToBeDeleted } from "@/lib/filter";

export type FetchEditMedia = Record<string, never>;

type Params = { params: { media_id: string } };
const successMessage = "Edit media successfully";
const unsuccessMessage = "Edit media failed";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.EDIT_MEDIA]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const formData = await request.formData();
        let body: z.infer<typeof editMediaSchema> = {
            mediaId: Number(params.media_id),
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            date: formData.get("date") as unknown as Date,
            existingMediaFiles:
                JSON.parse(formData.get("existingMediaFiles") as string) ?? [],
            imagesToUploadOrder:
                JSON.parse(formData.get("imagesToUploadOrder") as string) ?? [],
            imagesToUpload:
                (formData.getAll("imagesToUpload") as unknown as File[]) ?? [],
        };
        const validationResult = editMediaSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const media = await getMediaById(body.mediaId);
        if (!media) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const filesToRemove: string[] = findItemsToBeDeleted(
            body.existingMediaFiles.map((file) => file.filename),
            media.files,
            "filename",
        ).map((file) => file.filename);

        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if (filesToRemove.length > 0) {
            for (const filename of filesToRemove) {
                const response = await deleteFile(filename, sessionId ?? "");
                if (!response.success) {
                    const errorMessage =
                        response.errors[
                            Object.keys(
                                response.errors,
                            )[0] as keyof typeof response.errors
                        ];
                    return buildErrorResponse(
                        unsuccessMessage,
                        generateAndFormatZodError("unknown", errorMessage),
                        HttpStatusCode.BAD_REQUEST_400,
                    );
                }
            }
        }

        let images: z.infer<typeof existingMediaFilesSchema> =
            body.existingMediaFiles;
        if (body.imagesToUpload && body.imagesToUploadOrder) {
            if (body.imagesToUpload.length != body.imagesToUploadOrder.length) {
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError(
                        "unknown",
                        "Images and order are not the same length",
                    ),
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }

            const response = await uploadFiles(body.imagesToUpload, {
                sessionId: sessionId ?? "",
                belongTo: FileBelongTo.Media,
            });

            if (!response.success) {
                const errorMessage =
                    response.errors[
                        Object.keys(
                            response.errors,
                        )[0] as keyof typeof response.errors
                    ];
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError("unknown", errorMessage),
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }

            for (const filename of response.data.filenames) {
                images.push({
                    order: body.imagesToUploadOrder[
                        response.data.filenames.indexOf(filename)
                    ],
                    filename: filename,
                });
            }
        }

        if (images.length < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "At least one image is required",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        images = images.sort((a, b) => a.order - b.order);
        let mediaFiles: MediaFile[] = images.map((image) => ({
            filename: image.filename,
        }));

        const editResult = await editMediaById(body.mediaId, body, mediaFiles);
        // if no row is affected, meaning that the media didn't get edited
        if (editResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchEditMedia>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
