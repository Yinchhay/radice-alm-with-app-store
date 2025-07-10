import { db } from "@/drizzle/db";
import { ROWS_PER_BUG_REPORT_PAGE } from "@/lib/pagination";
import { bugReports } from "@/drizzle/schema";
import { testers } from "@/drizzle/schema";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { getFeedbackById } from "./feedback";

export const createBugReport = async (
    bugReport: typeof bugReports.$inferInsert,
) => {
    return await db.insert(bugReports).values(bugReport);
};

export async function getAllBugReportsByAppId(
    appId: number,
    page: number = 1,
    rowsPerPage: number = ROWS_PER_BUG_REPORT_PAGE,
) {
    try {
        const offset = (page - 1) * rowsPerPage;

        const result = await db
        .select({
            id: bugReports.id,
            testerId: bugReports.testerId,
            appId: bugReports.appId,
            title: bugReports.title,
            description: bugReports.description,
            image: bugReports.image,
            video: bugReports.video,
            tester: {
                firstName: testers.firstName,
                lastName: testers.lastName,
            }
        })
        .from(bugReports)
        .leftJoin(testers, eq(bugReports.testerId, testers.id))
        .where(eq(bugReports.appId, appId))
        .limit(rowsPerPage)
        .offset(offset);

        return result;

    } catch (error) {
        console.error("Error getting feedbacks by app ID:", error);
        throw error;
    }
}

export async function getBugReportsTotalRowByAppId( appId: number) {
    try {

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(bugReports)
            .where(eq(bugReports.appId, appId));

        return result[0].count;
    } catch (error) {
        console.error("Error getting feedbacks total count:", error);
        throw error;
    }
}