import { db } from "@/drizzle/db";
import { versions } from "@/drizzle/schema";
import { desc, eq, and, lt, or } from "drizzle-orm";

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



export async function getLatestVersionByProjectId(projectId: number) {
    const result = await db
        .select()
        .from(versions)
        .where(eq(versions.projectId, projectId),)
        .orderBy(desc(versions.createdAt))
        .limit(1);

    return result?.[0] || null;
}

export async function getCurrentAndAllPreviousVersionsByProjectId(projectId: number) {
    const current = await db.query.versions.findFirst({
        where: and(
            eq(versions.projectId, projectId),
            eq(versions.isCurrent, true)
        ),
    });

    if (!current) {
        return { current: null, previous: [] };
    }

    const isOlderThanCurrent = or(
        lt(versions.majorVersion, current.majorVersion),
        and(
            eq(versions.majorVersion, current.majorVersion),
            lt(versions.minorVersion, current.minorVersion)
        ),
        and(
            eq(versions.majorVersion, current.majorVersion),
            eq(versions.minorVersion, current.minorVersion),
            lt(versions.patchVersion, current.patchVersion)
        )
    );

    const previousVersions = await db
        .select()
        .from(versions)
        .where(
            and(
                eq(versions.projectId, projectId),
                isOlderThanCurrent
            )
        )
        .orderBy(
            desc(versions.majorVersion),
            desc(versions.minorVersion),
            desc(versions.patchVersion),
            desc(versions.createdAt)
        );

    return {
        current,
        previous: previousVersions,
    };
}

