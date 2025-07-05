import { db } from "@/drizzle/db";
import { versions } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export async function createVersion(data: {
    appId: number;
    projectId: number;
    versionNumber: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    isCurrent?: boolean;
    content: string;
}) {
    return db.insert(versions).values({
        appId: data.appId,
        projectId: data.projectId,
        versionNumber: data.versionNumber,
        majorVersion: data.majorVersion,
        minorVersion: data.minorVersion,
        patchVersion: data.patchVersion,
        isCurrent: data.isCurrent ?? false,
        content: data.content,
    });
}



export async function getLatestVersionByAppId(appId: number) {
    const result = await db
        .select()
        .from(versions)
        .where(eq(versions.appId, appId))
        .orderBy(desc(versions.createdAt))
        .limit(1);

    return result?.[0] || null;
}