import { db } from "@/drizzle/db";
import { bugReports } from "@/drizzle/schema";

export const createBugReport = async (
    bugReport: typeof bugReports.$inferInsert,
) => {
    return await db.insert(bugReports).values(bugReport);
};