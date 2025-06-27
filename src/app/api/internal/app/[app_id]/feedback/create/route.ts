import { formatZodError } from "@/lib/form";
import { lucia } from "@/auth/lucia";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createFeedback } from "@/repositories/feedback";
import { getTesterById } from "@/repositories/tester";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import { createFeedbackFormSchema } from "../schema";

export type FetchCreateFeedback = Record<string, never>;

const successMessage = "Create feedback successfully";
const unsuccessMessage = "Create feedback failed";

export async function POST(
    request: Request,
    { params }: { params: { app_id: string } },
) {
    try {
        // Get and validate tester session
        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            return buildNoBearerTokenErrorResponse();
        }

        const { session, user } = await lucia.validateSession(sessionId);

        if (!session || !user) {
            return buildNoBearerTokenErrorResponse();
        }

        const tester = await getTesterById(user.id);

        if (!tester) {
            return buildErrorResponse(
                "Unauthorized: Tester access required",
                { auth: "Invalid tester session" },
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        // Parse request body
        let body: z.infer<typeof createFeedbackFormSchema> =
            await request.json();
        body.testerId = tester.id;

        // Convert and validate appId
        const appId = parseInt(params.app_id, 10);
        if (isNaN(appId) || appId < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                { appId: "Invalid app ID" },
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body.appId = appId;

        console.log("Request body before validation:", body);

        // Validate the data
        const validationResult = createFeedbackFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        body = validationResult.data;

        // Create feedback
        const createResult = await createFeedback(body);

        // Check if creation was successful
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        return buildSuccessResponse<FetchCreateFeedback>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
