import { formatZodError } from "@/lib/form";
import { lucia } from "@/auth/lucia";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { deleteFeedback, getFeedbackById } from "@/repositories/feedback";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import { deleteFeedbackSchema } from "../schema";

export type FetchDeleteFeedback = Record<string, never>;

const successMessage = "Delete feedback successfully";
const unsuccessMessage = "Delete feedback failed";

export async function DELETE(request: Request) {
    try {
        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            return buildNoBearerTokenErrorResponse();
        }

        const { session, user } = await lucia.validateSession(sessionId);
        if (!session || !user) {
            return buildNoBearerTokenErrorResponse();
        }

        const body = await request.json();

        // Validate the data
        const validationResult = deleteFeedbackSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const { feedbackId } = validationResult.data;

        const feedback = await getFeedbackById(feedbackId);
        if (!feedback) {
            return buildErrorResponse(
                unsuccessMessage,
                { feedbackId: "Feedback not found" },
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (feedback.userId !== user.id) {
            return buildErrorResponse(
                unsuccessMessage,
                { feedbackId: "You can only delete your own feedback" },
                HttpStatusCode.FORBIDDEN_403,
            );
        }

        const deleteResult = await deleteFeedback(feedbackId);

        // Check if deletion was successful
        if (deleteResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        return buildSuccessResponse<FetchDeleteFeedback>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
