import { db } from "@/drizzle/db";
import { ROWS_PER_BUG_REPORT_PAGE } from "@/lib/pagination";
import { bugReports, testers, apps } from "@/drizzle/schema";
import { eq, desc, and, or, like, sql } from "drizzle-orm";


export const createBugReport = async (
    bugReport: typeof bugReports.$inferInsert,
) => {
    return await db.insert(bugReports).values(bugReport);
};

// Get Bug Report By Project ID using App ID
export async function getAllBugReportsByAppId(
    appId: number,
    page: number = 1,
    rowsPerPage: number = ROWS_PER_BUG_REPORT_PAGE,
) {
    try {
        const offset = (page - 1) * rowsPerPage;

        const app = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
        });

        if (!app || !app.projectId) {
            throw new Error("App Id is not found");
        }

        const result = await db
        .select({
            id: bugReports.id,
            testerId: bugReports.testerId,
            appId: bugReports.appId,
            projectId: bugReports.projectId,
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
        .where(eq(bugReports.projectId, app.projectId))
        .limit(rowsPerPage)
        .offset(offset);

        return result;

    } catch (error) {
        console.error("Error getting feedbacks by app ID:", error);
        throw error;
    }
}

//Get Bug Report Total Row By Project ID Using App ID
export async function getBugReportsTotalRowByAppId( appId: number) {
    try {

        const app = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
        });

        if (!app || !app.projectId) {
            throw new Error("App Id is not found");
        }

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(bugReports)
            .where(eq(bugReports.projectId, app.projectId));

        return result[0].count;
    } catch (error) {
        console.error("Error getting feedbacks total count:", error);
        throw error;
    }
}