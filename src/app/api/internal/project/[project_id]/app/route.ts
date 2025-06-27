import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
  buildErrorResponse,
  buildNoBearerTokenErrorResponse,
  buildNoPermissionErrorResponse,
  checkAndBuildErrorResponse,
  buildSuccessResponse,
} from "@/lib/response";
import { createApp, getAppByProjectId } from "@/repositories/app";
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

    const existingApps = await getAppByProjectId(projectId);
    if (existingApps && existingApps.length > 0) {
      return new Response(
        JSON.stringify({
          message: unsuccessMessage,
          errors: { project_id: "An app already exists for this project" },
          success: false,
          data: {
            appId: existingApps[0].id,
          },
        }),
        {
          status: HttpStatusCode.BAD_REQUEST_400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const createResult = await createApp({
      projectId: projectId,
      status: "draft"
    });

    if (createResult[0].affectedRows < 1) {
      throw new Error(ErrorMessage.SomethingWentWrong);
    }

    const appId = createResult[0].insertId;

    return buildSuccessResponse<FetchCreateApp>(successMessage, {
      appId: appId,
    });
  } catch (error: any) {
    return checkAndBuildErrorResponse(unsuccessMessage, error);
  }
}