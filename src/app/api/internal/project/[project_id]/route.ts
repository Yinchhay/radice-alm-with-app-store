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
import { getAllCategories } from "@/repositories/category";

const successMessage = "successMessage";
const unsuccessMessage = "unsuccessMessage";

type Params = { params: { project_id: string } };

export type GetAllCategoriesReturn = Awaited<
    ReturnType<typeof getAllCategories>
>;
export type FetchOneAssociatedProjectData = {
    project: Awaited<ReturnType<typeof getOneAssociatedProject>>;
    allCategories: GetAllCategoriesReturn;
};

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

        const allCategories = await getAllCategories();

        return buildSuccessResponse<FetchOneAssociatedProjectData>(
            successMessage,
            {
                project: project,
                allCategories: allCategories,
            },
        );
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
