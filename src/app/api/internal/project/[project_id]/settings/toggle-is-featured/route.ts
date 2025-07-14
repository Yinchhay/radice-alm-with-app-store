
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
    getOneAssociatedProject,
} from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { updateProjectFeaturedPrioritySchema } from "../../schema";
import { Permissions } from "@/types/IAM";
import {
    getAcceptedAppByProjectId,
    updateAppFeaturedPriority,
} from "@/repositories/app/internal";

const successMessage = "Successfully updated app settings featuredPriority";
const unsuccessMessage = "Failed to update app settings featuredPriority";

type Params = { params: { project_id: string } };
export type FetchUpdateProjectAppStatus = Record<string, unknown>;

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.CHANGE_PROJECT_STATUS]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let body: z.infer<typeof updateProjectFeaturedPrioritySchema> =
            await request.json();
        const validationResult = updateProjectFeaturedPrioritySchema.safeParse(body);
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

        const app = await getAcceptedAppByProjectId(Number(params.project_id));
        if (!app) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "App does not exist"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

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

        await updateAppFeaturedPriority(app.id, body.featuredPriority);

        return buildSuccessResponse<FetchUpdateProjectAppStatus>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
