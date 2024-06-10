import { checkBearerAndPermission, hasPermission } from "@/lib/IAM";
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
import {
    updateProjectPublicStatus,
    getOneAssociatedProject,
} from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { updateProjectPublicStatusSchema } from "../../schema";
import { Permissions } from "@/types/IAM";

const successMessage = "Successfully updated project settings publicStatus";
const unsuccessMessage = "Failed to update project settings publicStatus";

type Params = { params: { project_id: string } };
export type FetchUpdateProjectSettingsPublicStatus = Record<string, unknown>;

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

        let body: z.infer<typeof updateProjectPublicStatusSchema> =
            await request.json();
        const validationResult =
            updateProjectPublicStatusSchema.safeParse(body);
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

        const hasChangeProjectStatusPermission = (
            await hasPermission(
                user.id,
                new Set([Permissions.CHANGE_PROJECT_STATUS]),
            )
        ).canAccess;

        const { projectRole } = checkProjectRole(user.id, project, user.type);
        if (
            projectRole !== ProjectRole.OWNER &&
            projectRole !== ProjectRole.SUPER_ADMIN &&
            !hasChangeProjectStatusPermission
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

        await updateProjectPublicStatus(Number(params.project_id), body.status);

        return buildSuccessResponse<FetchUpdateProjectSettingsPublicStatus>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
