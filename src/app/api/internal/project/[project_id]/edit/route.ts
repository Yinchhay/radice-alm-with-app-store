import { checkBearerAndPermission } from "@/lib/IAM";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import { z } from "zod";
import {
    editProjectContentById,
    getOneAssociatedProject,
} from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { editProjectContentSchema } from "../schema";

const successMessage = "successMessage";
const unsuccessMessage = "unsuccessMessage";

type Params = { params: { project_id: string } };
export type FetchEditProjectContent = Awaited<
    ReturnType<typeof editProjectContentById>
>;

export async function PATCH(request: Request, { params }: Params) {
    try {
        const chapters = await request.json();
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const body: z.infer<typeof editProjectContentSchema> = {
            userId: user.id,
            projectId: params.project_id,
            chapters: JSON.stringify(chapters),
        };
        const validationResult = editProjectContentSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const project = await getOneAssociatedProject(Number(params.project_id));
        if (!project) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Project does not exist"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        const { projectRole, canEdit } = checkProjectRole(
            user.id,
            project,
            user.type,
        );
        if (!canEdit) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Unauthorized to edit project",
                ),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }
        const { updateSuccess, updatedProject } = await editProjectContentById(
            project.id,
            JSON.stringify(chapters),
        );
        if (!updateSuccess) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Unable to edit project"),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }
        return buildSuccessResponse<FetchEditProjectContent>(successMessage, {
            updateSuccess,
            updatedProject,
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
