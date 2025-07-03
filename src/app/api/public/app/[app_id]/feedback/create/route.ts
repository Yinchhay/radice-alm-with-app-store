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
import { db } from "@/drizzle/db"; // or wherever your db client is
import { eq } from "drizzle-orm";
import { testers } from "@/drizzle/schema";
import { createFeedbackFormSchema } from "../schema";

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

        //Extract and validate authorization header
       const authorizationHeader = request.headers.get("Authorization");
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return buildNoBearerTokenErrorResponse();
        }

        const token = authorizationHeader.replace("Bearer ", "");

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
        const appId = parseInt(params.app_id, 10);
        if (isNaN(appId) || appId < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                { appId: "Invalid app ID" },
                HttpStatusCode.BAD_REQUEST_400,
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
