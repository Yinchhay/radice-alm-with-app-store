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
import jwt from "jsonwebtoken";
import { db } from "@/drizzle/db"; // or wherever your db client is
import { eq } from "drizzle-orm";
import { testers } from "@/drizzle/schema";
import { Permissions } from "@/types/IAM";
import { createBugReportFormSchema} from "./schema";
import { cookies } from "next/headers";

export type FetchCreateBugReport = { 
  bugReportId: number;
};

const successMessage = "Created bug report successfully";
const unsuccessMessage = "Create bug report failed";

interface TesterJwtPayload {
    id: string;
    email: string;
    type: "tester";
}

export async function POST(
    request: Request,
    { params }: { params: { app_id: string } }
) {
  try {

     //Extract and validate authorization header
        let token: string | undefined = undefined;
        const authorizationHeader = request.headers.get("Authorization");
        if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.replace("Bearer ", "");
        }
        if (!token) {
            const cookieStore = cookies();
            token = cookieStore.get("tester-token")?.value;
        }
        if (!token) {
            return buildNoBearerTokenErrorResponse();
        }

        // safely read and verify the JWT token
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("Missing JWT_SECRET in environment");
            throw new Error("Server misconfiguration: JWT secret is not set");
        }

        let payload: TesterJwtPayload;
        try {
            payload = jwt.verify(token, JWT_SECRET!) as TesterJwtPayload;
        } catch (err) {
            console.error("JWT Verification Failed:", err);
            return buildNoPermissionErrorResponse();
        }

        const testerId = payload.id;
        if (!testerId) {
            return buildNoPermissionErrorResponse();
        }

        const [tester] = await db
            .select()
            .from(testers)
            .where(eq(testers.id, testerId))
            .limit(1);

        if (!tester) {
            return buildNoPermissionErrorResponse();
        }

        // Convert and validate appId
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
        testerId: testerId,
        appId: body.appId,
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