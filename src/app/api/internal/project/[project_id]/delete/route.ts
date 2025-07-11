import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { deleteProject } from "@/repositories/project";
import { NextRequest } from "next/server";
import { Permissions } from "@/types/IAM";
import { checkBearerAndPermission } from "@/lib/IAM";
import { db } from "@/drizzle/db";
import { projects } from "@/drizzle/schema";
import { HttpStatusCode } from "@/types/http";
import { eq } from "drizzle-orm";

const successMessage = "Project deleted successfully";
const unsuccessMessage = "Failed to delete project";

export type FetchDeleteProject = Record<string, never>;

type Params = { params: { project_id: string } };

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        // Permission check
        const requiredPermission = new Set([Permissions.CREATE_OWN_PROJECTS]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);

        if (errorNoBearerToken) return buildNoBearerTokenErrorResponse();
        if (errorNoPermission) return buildNoPermissionErrorResponse();

        // Validate project ID
        const projectId = Number(params.project_id);
        if (isNaN(projectId) || projectId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                { project_id: "Invalid project ID" },
                HttpStatusCode.BAD_REQUEST_400
            );
        }

        // Check if project exists
        const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        if (!project) {
            return buildErrorResponse(
                unsuccessMessage,
                { project_id: "Project not found" },
                HttpStatusCode.NOT_FOUND_404
            );
        }

        // Delete project
        const result = deleteProject(projectId);
        return buildSuccessResponse<FetchDeleteProject>(
            successMessage,
            {},
        )
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
