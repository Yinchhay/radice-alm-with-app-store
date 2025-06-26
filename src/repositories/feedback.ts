import { db } from "@/drizzle/db";
import { feedbacks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const createFeedback = async (
    feedback: typeof feedbacks.$inferInsert,
) => {
    return await db.insert(feedbacks).values(feedback);
};

export async function getFeedbackById(feedbackId: number) {
    try {
        const result = await db
            .select()
            .from(feedbacks)
            .where(eq(feedbacks.id, feedbackId))
            .limit(1);

        return result[0] || null;
    } catch (error) {
        console.error("Error getting feedback by ID:", error);
        throw error;
    }
}

export async function deleteFeedback(feedbackId: number) {
    try {
        const result = await db
            .delete(feedbacks)
            .where(eq(feedbacks.id, feedbackId));

        return result;
    } catch (error) {
        console.error("Error deleting feedback:", error);
        throw error;
    }
}
