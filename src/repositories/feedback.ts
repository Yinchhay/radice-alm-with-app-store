import { db } from "@/drizzle/db";
import { ROWS_PER_FEEDBACK_PAGE } from "@/lib/pagination";
import { feedbacks } from "@/drizzle/schema";
import { testers } from "@/drizzle/schema";
import { eq, asc, desc, and, or, like, sql } from "drizzle-orm";

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

//Get Feedback By App
export async function getAllFeedbacksByAppId(
    appId: number,
    page: number = 1,
    rowsPerPage: number = ROWS_PER_FEEDBACK_PAGE,
) {
    try {
        const offset = (page - 1) * rowsPerPage;

        // const result = await db
        //     .select()
        //     .from(feedbacks)
        //     .where(eq(feedbacks.appId, appId))
        //     .orderBy(desc(feedbacks.createdAt))
        //     .limit(rowsPerPage)
        //     .offset(offset);


        const result = await db
            .select({
                id: feedbacks.id,
                testerId: feedbacks.testerId,
                appId: feedbacks.appId,
                title: feedbacks.title,
                review: feedbacks.review,
                starRating: feedbacks.starRating,
                createdAt: feedbacks.createdAt,
                updatedAt: feedbacks.updatedAt,
                tester: {
                    firstName: testers.firstName,
                    lastName: testers.lastName,
                }
            })
            .from(feedbacks)
            .leftJoin(testers, eq(feedbacks.testerId, testers.id))
            .where(eq(feedbacks.appId, appId))
            .orderBy(desc(feedbacks.createdAt))
            .limit(rowsPerPage)
            .offset(offset);

        return result;
    } catch (error) {
        console.error("Error getting feedbacks by app ID:", error);
        throw error;
    }
}

// New function to get feedbacks by tester ID
export async function getAllFeedbacksByTesterId(
    testerId: string,
    page: number,
    rowsPerPage: number,
    search: string = "",
) {
    try {
        const offset = (page - 1) * rowsPerPage;
        let whereCondition;

        if (search) {
            whereCondition = and(
                eq(feedbacks.testerId, testerId),
                or(
                    like(feedbacks.review, `%${search}%`),
                    like(feedbacks.title, `%${search}%`),
                ),
            );
        } else {
            whereCondition = eq(feedbacks.testerId, testerId);
        }

        const result = await db
            .select()
            .from(feedbacks)
            .where(whereCondition)
            .orderBy(asc(feedbacks.createdAt))
            .limit(rowsPerPage)
            .offset(offset);

        return result;
    } catch (error) {
        console.error("Error getting feedbacks by tester ID:", error);
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

export async function getFeedbacksTotalRowByAppId( appId: number) {
    try {

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(feedbacks)
            .where(eq(feedbacks.appId, appId));

        return result[0].count;
    } catch (error) {
        console.error("Error getting feedbacks total count:", error);
        throw error;
    }
}

// New function to get total feedback count by tester ID
export async function getFeedbacksTotalRowByTesterId(
    testerId: string,
    search: string = "",
) {
    try {
        let whereCondition;

        if (search) {
            whereCondition = and(
                eq(feedbacks.testerId, testerId),
                or(
                    like(feedbacks.review, `%${search}%`),
                    like(feedbacks.title, `%${search}%`),
                ),
            );
        } else {
            whereCondition = eq(feedbacks.testerId, testerId);
        }

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(feedbacks)
            .where(whereCondition);

        return result[0].count;
    } catch (error) {
        console.error(
            "Error getting feedbacks total count by tester ID:",
            error,
        );
        throw error;
    }
}
