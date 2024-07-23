import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { deleteMediaById, getMediaById } from "@/repositories/media";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { deleteMediaSchema } from "../../schema";
import { deleteFile } from "@/lib/file";
import { lucia } from "@/auth/lucia";

// update type if we were to return any data back to the response
export type FetchDeleteMedia = Record<string, never>;

type Params = { params: { media_id: string } };
const successMessage = "Delete media successfully";
const unsuccessMessage = "Delete media failed";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.DELETE_MEDIA]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let data: z.infer<typeof deleteMediaSchema> = {
            mediaId: Number(params.media_id),
        };
        const validationResult = deleteMediaSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        data = validationResult.data;

        // Delete all files associated with the media first before deleting the media from the database
        const media = await getMediaById(data.mediaId);
        if (!media) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
        if (media.files.length > 0) {
            for (const image of media.files) {
                const response = await deleteFile(
                    image.filename,
                    sessionId ?? "",
                );
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

        const deleteResult = await deleteMediaById(data.mediaId);
        // if no row is affected, meaning that the media didn't get deleted
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchDeleteMedia>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
