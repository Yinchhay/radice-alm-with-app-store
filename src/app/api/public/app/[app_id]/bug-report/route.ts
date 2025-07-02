import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
  buildErrorResponse,
  buildNoBearerTokenErrorResponse,
  buildNoPermissionErrorResponse,
  checkAndBuildErrorResponse,
  buildSuccessResponse,
} from "@/lib/response";
import { createBugReport } from "@/repositories/bug_report";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createBugReportFormSchema} from "./schema";

export type FetchCreateBugReport = { 
  bugReportId: number;
};

const successMessage = "Created bug report successfully";
const unsuccessMessage = "Create bug report failed";

export async function POST(
    request: Request,
    { params }: { params: { app_id: string } }
) {
  try {
    // const requiredPermission = new Set([]);
    // const { errorNoBearerToken, errorNoPermission, user } =
    //   await checkBearerAndPermission(request, requiredPermission);
    
    // if (errorNoBearerToken) {
    //   return buildNoBearerTokenErrorResponse();
    // }
    
    // if (errorNoPermission) {
    //   return buildNoPermissionErrorResponse();
    // }

    const appId = parseInt(params.app_id);
    if (isNaN(appId) || appId <= 0) {
      return new Response(
        JSON.stringify({
          message: unsuccessMessage,
          errors: { app_id: "Invalid App ID" },
          success: false,   
        }),
        {
          status: HttpStatusCode.BAD_REQUEST_400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const jsonBody = await request.json();
    const parsed = createBugReportFormSchema.safeParse({
      ...jsonBody,
      appId,
    });
    
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          message: unsuccessMessage,
          errors: parsed.error.flatten().fieldErrors,
          success: false,
        }),
        {
          status: HttpStatusCode.BAD_REQUEST_400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = parsed.data;

    // const existingApps = await getAppByProjectId(projectId);
    // if (existingApps && existingApps.length > 0) {
    //   return new Response(
    //     JSON.stringify({
    //       message: unsuccessMessage,
    //       errors: { project_id: "An app already exists for this project" },
    //       success: false,
    //       data: {
    //         bugId: existingApps[0].id,
    //       },
    //     }),
    //     {
    //       status: HttpStatusCode.BAD_REQUEST_400,
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    // }

    const createResult = await createBugReport({
        title: body.title,
        description: body.description,
        image: body.image,
        video: body.video,
    });

    if (createResult[0].affectedRows < 1) {
      throw new Error(ErrorMessage.SomethingWentWrong);
    }

    const bugReportId = createResult[0].insertId;

    return buildSuccessResponse<FetchCreateBugReport>(successMessage, {
      bugReportId: bugReportId,
    });

  } catch (error: any) {
    return checkAndBuildErrorResponse(unsuccessMessage, error);
  }
}