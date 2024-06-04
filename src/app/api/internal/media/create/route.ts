import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createMedia } from "@/repositories/media";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createMediaSchema } from "../schema";
import { lucia } from "@/auth/lucia";
import { uploadFiles } from "@/lib/file";
import { MediaFile } from "@/drizzle/schema";

export type FetchCreateMedia = Record<string, never>;

const successMessage = "Create media successfully";
const unsuccessMessage = "Create media failed";

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([Permissions.CREATE_MEDIA]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const formData = await request.formData();
        // check if user sent a mediaLogo
        const body: z.infer<typeof createMediaSchema> = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            date: formData.get("date") as unknown as Date,
            images: formData.getAll("images") as unknown as File[],
        };
        const validationResult = createMediaSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        let imageFilenames: MediaFile[] = [];
        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
        const response = await uploadFiles(body.images, sessionId ?? "");

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
        imageFilenames = response.data.filenames.map((filename: string) => ({
            filename: filename,
        }));

        if (imageFilenames && imageFilenames.length < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "At least one image is required",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const createResult = await createMedia({
            title: body.title,
            description: body.description,
            date: new Date(body.date),
            files: imageFilenames,
        });
        // if no row is affected, meaning that creating media failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        return buildSuccessResponse<FetchCreateMedia>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
