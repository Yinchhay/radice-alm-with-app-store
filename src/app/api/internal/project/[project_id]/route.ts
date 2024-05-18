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
import { getOneAssociatedProjectSchema } from "./schema";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getOneAssociatedProject } from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";

const successMessage = "successMessage";
const unsuccessMessage = "unsuccessMessage";

type Params = { params: { project_id: string } };
export type FetchOneAssociatedProjectData = Awaited<
    ReturnType<typeof getOneAssociatedProject>
>;

export async function GET(request: Request, { params }: Params) {
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

        const body: z.infer<typeof getOneAssociatedProjectSchema> = {
            userId: user.id,
            projectId: params.project_id,
        };
        const validationResult = getOneAssociatedProjectSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const project = await getOneAssociatedProject(params.project_id);
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
        if (projectRole === ProjectRole.NONE) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Unauthorized to access project",
                ),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }
        return buildSuccessResponse<FetchOneAssociatedProjectData>(
            successMessage,
            project,
        );
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
