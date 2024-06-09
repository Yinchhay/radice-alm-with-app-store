import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { editMediaById } from "@/repositories/media";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { editMediaSchema } from "../../schema";

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

        let body: z.infer<typeof editMediaSchema> = await request.json();
        body.mediaId = Number(params.media_id);
        body.date = new Date(body.date);
        const validationResult = editMediaSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const editResult = await editMediaById(body.mediaId, body);
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
