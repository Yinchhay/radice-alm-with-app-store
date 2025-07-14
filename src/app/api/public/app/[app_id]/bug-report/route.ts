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
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { testers, bugReports, projects, apps } from "@/drizzle/schema";
import { createBugReportFormSchema } from "./schema";
import { cookies } from "next/headers";
import { 
  saveUploadedFile, 
  validateFile, 
  validateVideoFile,
  deleteOldFile 
} from "@/repositories/app/images";

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

    const app = await db.query.apps.findFirst({
      where: eq(apps.id, appId),
    });

    if (!app || !app.projectId) {
      return buildErrorResponse(
        unsuccessMessage,
        { app: "App not found or has no project ID" },
        HttpStatusCode.NOT_FOUND_404
      );
    }

    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    const imageFile = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;

    if (!title || !description) {
      return buildErrorResponse(
        unsuccessMessage,
        { 
          title: !title ? "Title is required" : undefined,
          description: !description ? "Description is required" : undefined,
        },
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    let imagePath: string | null = null;
    let videoPath: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const imageValidation = validateFile(imageFile);
      if (!imageValidation.valid) {
        return buildErrorResponse(
          unsuccessMessage,
          { image: imageValidation.error },
          HttpStatusCode.BAD_REQUEST_400
        );
      }
      
      try {
        imagePath = await saveUploadedFile(imageFile, appId, "image");
      } catch (error) {
        console.error("Error saving image file:", error);
        return buildErrorResponse(
          unsuccessMessage,
          { image: "Failed to save image file" },
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }
    }

    if (videoFile && videoFile.size > 0) {
      const videoValidation = validateVideoFile(videoFile);
      if (!videoValidation.valid) {
        if (imagePath) {
          await deleteOldFile(imagePath);
        }
        return buildErrorResponse(
          unsuccessMessage,
          { video: videoValidation.error },
          HttpStatusCode.BAD_REQUEST_400
        );
      }
      
      try {
        videoPath = await saveUploadedFile(videoFile, appId, "video");
      } catch (error) {
        console.error("Error saving video file:", error);
        if (imagePath) {
          await deleteOldFile(imagePath);
        }
        return buildErrorResponse(
          unsuccessMessage,
          { video: "Failed to save video file" },
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }
    }

    const parsed = createBugReportFormSchema.safeParse({
      title,
      description,
      image: imagePath,
      video: videoPath,
      appId,
    });
    
    if (!parsed.success) {
      if (imagePath) await deleteOldFile(imagePath);
      if (videoPath) await deleteOldFile(videoPath);
      
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

    const createResult = await createBugReport({
        title: body.title,
        description: body.description,
        image: body.image,
        video: body.video,
        testerId: testerId,
        projectId: app.projectId,
        appId: appId,
    });

    if (createResult[0].affectedRows < 1) {
      if (imagePath) await deleteOldFile(imagePath);
      if (videoPath) await deleteOldFile(videoPath);
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