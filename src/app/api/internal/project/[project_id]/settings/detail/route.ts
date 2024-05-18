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
import { z } from "zod";
import {
    editProjectSettingDetailById,
    getOneAssociatedProject,
} from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { editProjectSettingsDetail, fileImageSchema } from "../../schema";
import { uploadFiles } from "@/lib/file";
import { lucia } from "@/auth/lucia";
import {
    createProjectCategory,
    deleteProjectCategory,
} from "@/repositories/project_category";

const successMessage = "Successfully updated project settings detail";
const unsuccessMessage = "Failed to update project settings detail";

type Params = { params: { project_id: string } };
export type FetchEditProjectSettingsDetail = Record<string, unknown>;

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

        // check if user sent a projectLogo
        let logoUrl;
        if (formData.has("projectLogo")) {
            const file = formData.get("projectLogo") as File;
            // validate file for its type, size
            const validationResult = fileImageSchema.safeParse({
                image: file,
            });
            if (!validationResult.success) {
                return buildErrorResponse(
                    unsuccessMessage,
                    formatZodError(validationResult.error),
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }
            const files = [file];
            const authorizationHeader = request.headers.get("Authorization");
            const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
            const response = await uploadFiles(files, sessionId ?? "");
            
            if (!response.success) {
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError(
                        "unknown",
                        "Failed to upload image",
                    ),
                    HttpStatusCode.BAD_REQUEST_400,
                );
            }
            logoUrl = response.data.filenames[0];
        }

        const projectCategories = formData.get("projectCategories");
        const body: z.infer<typeof editProjectSettingsDetail> = {
            projectName: formData.get("projectName") as string,
            projectDescription: formData.get("projectDescription") as string,
            userId: user.id,
            projectId: params.project_id,
            logoUrl,
            projectCategories: projectCategories
                ? JSON.parse(projectCategories as string)
                : [],
        };
        const validationResult = editProjectSettingsDetail.safeParse(body);
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

        // if user did not send a logo, use the existing logo
        if (!logoUrl) {
            logoUrl = project.logoUrl;
        }

        // start update category
        if (
            body.projectCategories &&
            body.projectCategories &&
            body.projectCategories.length > 0
        ) {
            const toBeCreatedCategories = body.projectCategories.filter(
                (categoryId) =>
                    !project.projectCategories.find(
                        (projectCategory) =>
                            projectCategory.categoryId === categoryId,
                    ),
            );

            const toBeDeletedCategories = project.projectCategories.filter(
                (projectCategory) =>
                    !body.projectCategories?.includes(
                        projectCategory.categoryId,
                    ),
            );

            for (const categoryId of toBeCreatedCategories) {
                await createProjectCategory(project.id, categoryId);
            }

            for (const projectCategory of toBeDeletedCategories) {
                await deleteProjectCategory(projectCategory.id);
            }
        }

        await editProjectSettingDetailById(Number(body.projectId), {
            name: body.projectName,
            description: body.projectDescription,
            logo: logoUrl,
        });

        return buildSuccessResponse<FetchEditProjectSettingsDetail>(
            successMessage,
            {},
        );
    } catch (error: any) {
        console.log(error);
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
