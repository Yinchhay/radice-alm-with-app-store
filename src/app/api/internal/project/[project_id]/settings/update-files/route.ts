import { checkBearerAndPermission } from "@/lib/IAM";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import { getOneAssociatedProject } from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { editProjectSettingsFiles } from "../../schema";
import { lucia } from "@/auth/lucia";
import { deleteFile, uploadFiles } from "@/lib/file";

const successMessage = "Successfully updated project settings files";
const unsuccessMessage = "Failed to update project settings files";

type Params = { params: { project_id: string } };
export type FetchEditProjectSettingsFiles = Record<string, unknown>;

export async function PATCH(request: Request, { params }: Params) {
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
        let body: z.infer<typeof editProjectSettingsFiles> = {
            fileToRemove: formData.getAll("fileToRemove") as string[],
            fileToUpload: formData.getAll("fileToUpload") as File[],
        };

        const validationResult = editProjectSettingsFiles.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const project = await getOneAssociatedProject(
            Number(params.project_id),
        );
        if (!project) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Project does not exist"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        const { projectRole } = checkProjectRole(user.id, project, user.type);
        if (
            projectRole !== ProjectRole.OWNER &&
            projectRole !== ProjectRole.SUPER_ADMIN
        ) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Unauthorized to edit project",
                ),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
        if (body.fileToRemove) {
            for (const filename of body.fileToRemove) {
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
        if (body.fileToUpload) {
            const response = await uploadFiles(
                body.fileToUpload,
                sessionId ?? "",
                Number(params.project_id),
            );

            if (!response.success) {
                // {errors : {undefined: "Expected object, received string"}}
                // could be any key value pair, not just undefined
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

        return buildSuccessResponse<FetchEditProjectSettingsFiles>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
