import { checkBearerAndPermission } from "@/lib/IAM";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import {
    editAppById,
    getAppById,
    getAssociatedProjectsOfApp,
} from "@/repositories/app/internal";
import { checkProjectRole } from "@/lib/project";
import { editAppFormSchema } from "../../schema";
import { getOneAssociatedProject } from "@/repositories/project";

const successMessage = "App updated successfully";
const unsuccessMessage = "Failed to update app";

type Params = { params: { app_id: string } };

export type FetchEditApp = Awaited<ReturnType<typeof editAppById>>;

export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        // Check for Bearer Token and Permissions
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }
        
        // Validate app ID
        const appId = Number(params.app_id);
        
        if (isNaN(appId) || appId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Check if app exists first
        const app = await getAppById(appId);
        
        if (!app) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "App does not exist"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // Parse JSON request body
        const requestBody = await request.json();

        // Validate the request body against schema
        const validationResult = editAppFormSchema.safeParse(requestBody);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const validatedData = validationResult.data;

        // Get associated projects to check permissions
        const associatedProjects = await getAssociatedProjectsOfApp(appId);
        
        if (!associatedProjects || associatedProjects.length === 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Associated project not found"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const projectId = associatedProjects[0].project.id;

        // Fetch the complete project data with members and partners
        const projectWithMembersAndPartners = await getOneAssociatedProject(projectId);
        
        if (!projectWithMembersAndPartners) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Project data not found"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // Check for Project Role
        const { canEdit } = checkProjectRole(user.id, projectWithMembersAndPartners, user.type);
        
        if (!canEdit) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Unauthorized to edit this app"
                ),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        // Prepare update data - filter out undefined/null values
        const updateData = Object.fromEntries(
            Object.entries(validatedData).filter(([_, value]) => 
                value !== undefined && value !== null
            )
        );

        // Check if there's actual data to update
        if (Object.keys(updateData).length === 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "No valid data provided for update"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        // Edit app
        const result = await editAppById(appId, updateData);
        
        if (!result.updateSuccess || !result.updatedApp) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", result.error || "Failed to update app in database"),
                HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            );
        }
        
        // Return success response
        return buildSuccessResponse(successMessage, {
            updateSuccess: result.updateSuccess,
            updatedApp: result.updatedApp,
        });

    } catch (error: any) {
        return buildErrorResponse(
            unsuccessMessage,
            generateAndFormatZodError("unknown", `Server error: ${error.message}`),
            HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        );
    }
}