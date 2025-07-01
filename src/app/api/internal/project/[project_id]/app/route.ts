import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
  buildErrorResponse,
  buildNoBearerTokenErrorResponse,
  buildNoPermissionErrorResponse,
  checkAndBuildErrorResponse,
  buildSuccessResponse,
} from "@/lib/response";
import { createApp, getAppWithAllRelations } from "@/repositories/app";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";

export type FetchCreateApp = {
  appId: number;
};

const successMessage = "Created app successfully";
const unsuccessMessage = "Create app failed";

export async function POST(
  request: Request,
  { params }: { params: { project_id: string } }
) {
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

    const projectId = parseInt(params.project_id);
    if (isNaN(projectId) || projectId <= 0) {
      return new Response(
        JSON.stringify({
          message: unsuccessMessage,
          errors: { project_id: "Invalid project ID" },
          success: false,
        }),
        {
          status: HttpStatusCode.BAD_REQUEST_400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const createResult = await createApp({
        projectId: projectId,
        status: "draft"
      });
      let appId: number;
      
      if (Array.isArray(createResult) && createResult.length > 0) {
        // If using MySQL adapter, it might have insertId
        if ('insertId' in createResult[0]) {
          appId = createResult[0].insertId as number;
        } else if ('id' in createResult[0]) {
          // If the full record is returned
          appId = (createResult[0] as any).id;
        } else {
          throw new Error("Unable to get app ID from create result");
        }
      } else {
        throw new Error("Create operation did not return expected result");
      }

      return buildSuccessResponse<FetchCreateApp>(successMessage, {
        appId: appId,
      });

    } catch (createError: any) {
      // Handle the case where an app already exists for this project
      // This would typically be a constraint violation error
      if (createError.code === 'ER_DUP_ENTRY' || 
          createError.message?.includes('UNIQUE constraint') ||
          createError.message?.includes('duplicate')) {
        
        // Try to find the existing app for this project
        // Since we don't have a direct function, we could add a simple query here
        // or modify the repository to add this function
        return new Response(
          JSON.stringify({
            message: unsuccessMessage,
            errors: { project_id: "An app already exists for this project" },
            success: false,
          }),
          {
            status: HttpStatusCode.BAD_REQUEST_400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      
      // Re-throw other errors
      throw createError;
    }

  } catch (error: any) {
    return checkAndBuildErrorResponse(unsuccessMessage, error);
  }
}