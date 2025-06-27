import { db } from "@/drizzle/db";
import { feedbacks } from "@/drizzle/schema";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

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

export async function getAllFeedbacksByAppId(
    appId: number,
    page: number,
    rowsPerPage: number,
    search: string = "",
) {
    try {
        const offset = (page - 1) * rowsPerPage;

        let whereCondition;
        if (search) {
            whereCondition = and(
                eq(feedbacks.appId, appId),
                or(
                    ilike(feedbacks.review, `%${search}%`),
                    ilike(feedbacks.title, `%${search}%`),
                ),
            );
        } else {
            whereCondition = eq(feedbacks.appId, appId);
        }

        const result = await db
            .select()
            .from(feedbacks)
            .where(whereCondition)
            .orderBy(desc(feedbacks.createdAt))
            .limit(rowsPerPage)
            .offset(offset);

        return result;
    } catch (error) {
        console.error("Error getting feedbacks by app ID:", error);
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

export async function getFeedbacksTotalRowByAppId(
    appId: number,
    search: string = "",
) {
    try {
        let whereCondition;
        if (search) {
            whereCondition = and(
                eq(feedbacks.appId, appId),
                or(
                    ilike(feedbacks.review, `%${search}%`),
                    ilike(feedbacks.title, `%${search}%`),
                ),
            );
        } else {
            whereCondition = eq(feedbacks.appId, appId);
        }

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(feedbacks)
            .where(whereCondition);

        return result[0].count;
    } catch (error) {
        console.error("Error getting feedbacks total count:", error);
        throw error;
    }
}
