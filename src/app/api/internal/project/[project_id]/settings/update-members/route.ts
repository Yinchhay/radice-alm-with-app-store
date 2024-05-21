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
import {
    editProjectSettingMembersById,
    getOneAssociatedProject,
    GetProjects_C_Tag,
    OneAssociatedProject_C_Tag,
} from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { revalidateTags } from "@/lib/server_utils";
import { editProjectSettingsMembers } from "../../schema";

const successMessage = "Successfully updated project settings members";
const unsuccessMessage = "Failed to update project settings members";

type Params = { params: { project_id: string } };
export type FetchEditProjectSettingsMembers = Record<string, unknown>;

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

        const body: z.infer<typeof editProjectSettingsMembers> =
            await request.json();
        const validationResult = editProjectSettingsMembers.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

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

        await editProjectSettingMembersById(Number(params.project_id), body);

        await revalidateTags<OneAssociatedProject_C_Tag | GetProjects_C_Tag>(
            "OneAssociatedProject_C_Tag",
            "getProjects_C_Tag",
        );

        return buildSuccessResponse<FetchEditProjectSettingsMembers>(
            successMessage,
            {},
        );
    } catch (error: any) {
        console.error(error);
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
