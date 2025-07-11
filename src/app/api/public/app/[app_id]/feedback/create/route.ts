import { formatZodError } from "@/lib/form";
import {
    buildNoPermissionErrorResponse,
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createFeedback } from "@/repositories/feedback";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getTesterById } from "@/repositories/tester";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { db } from "@/drizzle/db"; 
import { eq } from "drizzle-orm";
import { testers, apps } from "@/drizzle/schema";
import { createFeedbackFormSchema } from "../schema";
import { cookies } from "next/headers";

export type FetchCreateFeedback = {
    feedbackId: number,
};

const successMessage = "Create feedback successfully";
const unsuccessMessage = "Create feedback failed";

interface TesterJwtPayload {
    id: string;
    email: string;
    type: "tester";
}

export async function POST(
    request: Request,
    { params }: { params: { app_id: string } },
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

        //Read and verify the JWT token
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
        const appId = parseInt(params.app_id, 10);
        if (isNaN(appId) || appId < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                { appId: "Invalid app ID" },
                HttpStatusCode.BAD_REQUEST_400,
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

        const jsonBody = await request.json();
        const parsed = createFeedbackFormSchema.safeParse({
            ...jsonBody, 
            appId,
        });

        if (!parsed.success) {
          return buildErrorResponse(
            unsuccessMessage,
            formatZodError(parsed.error),
            HttpStatusCode.BAD_REQUEST_400
          );
        }

        const body = parsed.data

        const createResult = await createFeedback({
            appId: body.appId,
            testerId: testerId,
            projectId: app.projectId,
            title: body.title,
            review: body.review,
            starRating: body.starRating,
        });
        

        // Check if creation was successful
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        const feedbackId = createResult[0].insertId;

        return buildSuccessResponse<FetchCreateFeedback>(successMessage, {
            feedbackId: feedbackId,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
