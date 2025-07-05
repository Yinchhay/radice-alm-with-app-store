import { db } from "@/drizzle/db";
import { versionLogs } from "@/drizzle/schema";

export async function createVersionLog(data: {
    versionId: number;
    action: string;
    content: string;
    createdBy: string;
}) {
    return db.insert(versionLogs).values({
        versionId: data.versionId,
        action: data.action,
        content: data.content,
        createdBy: data.createdBy,
    });
}
