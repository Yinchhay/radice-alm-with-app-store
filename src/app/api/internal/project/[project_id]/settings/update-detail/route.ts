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
    editProjectSettingDetailById,
    getOneAssociatedProject,
} from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { editProjectSettingsDetail, fileImageSchema } from "../../schema";
import { deleteFile, uploadFiles } from "@/lib/file";
import { lucia } from "@/auth/lucia";
import { findItemsToBeCreated, findItemsToBeDeleted } from "@/lib/filter";
import { FileBelongTo } from "@/drizzle/schema";

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
            const response = await uploadFiles(files, {
                sessionId: sessionId ?? "",
                belongTo: FileBelongTo.ProjectSetting,
            });

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

            await deleteFile(project.logoUrl || "", sessionId ?? "");
            logoUrl = response.data.filenames[0];
        }

        const projectCategories = formData.get("projectCategories");
        let body: z.infer<typeof editProjectSettingsDetail> = {
            projectName: formData.get("projectName") as string,
            projectDescription: formData.get("projectDescription") as string,
            userId: user.id,
            logoUrl,
            // ids of categories to be added or removed
            projectCategories: projectCategories
                ? JSON.parse(projectCategories as string)
                : ([] as number[]),
        };
        const validationResult = editProjectSettingsDetail.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        // if user did not send a logo, use the existing logo
        if (!logoUrl) {
            logoUrl = project.logoUrl;
        }

        // start update category
        const categoriesToBeAdded = findItemsToBeCreated(
            body.projectCategories as number[],
            project.projectCategories,
            "categoryId",
        ) as number[];

        const projectCategoriesToBeDeleted = findItemsToBeDeleted(
            body.projectCategories as number[],
            project.projectCategories,
            "categoryId",
        ).map((projectCategory) => projectCategory.id);

        await editProjectSettingDetailById(Number(params.project_id), {
            name: body.projectName,
            description: body.projectDescription,
            logo: logoUrl,
            categoriesToBeAdded,
            projectCategoriesToBeDeleted,
        });

        return buildSuccessResponse<FetchEditProjectSettingsDetail>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
