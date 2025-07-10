import { db } from "@/drizzle/db";
import { versions } from "@/drizzle/schema";
import { desc, eq, and, lt, or } from "drizzle-orm";
import type { MySqlTransaction } from "drizzle-orm/mysql-core";

type UpdateVersionContent = {
    versionId: number;
    content?: string;
};

/*
 *** TYPE DECLARATION END TYPE DECLARATION END TYPE DECLARATION END TYPE DECLARATION END
 */
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
        .where(eq(versions.projectId, projectId))
        .orderBy(desc(versions.createdAt))
        .limit(1);

    return result?.[0] || null;
}

export async function getCurrentAndAllPreviousVersionsByProjectId(
    projectId: number,
) {
    const current = await db.query.versions.findFirst({
        where: and(
            eq(versions.projectId, projectId),
            eq(versions.isCurrent, true),
        ),
    });

    if (!current) {
        return { current: null, previous: [] };
    }

    const isOlderThanCurrent = or(
        lt(versions.majorVersion, current.majorVersion),
        and(
            eq(versions.majorVersion, current.majorVersion),
            lt(versions.minorVersion, current.minorVersion),
        ),
        and(
            eq(versions.majorVersion, current.majorVersion),
            eq(versions.minorVersion, current.minorVersion),
            lt(versions.patchVersion, current.patchVersion),
        ),
    );

    const previousVersions = await db
        .select()
        .from(versions)
        .where(and(eq(versions.projectId, projectId), isOlderThanCurrent))
        .orderBy(
            desc(versions.majorVersion),
            desc(versions.minorVersion),
            desc(versions.patchVersion),
            desc(versions.createdAt),
        );

    return {
        current,
        previous: previousVersions,
    };
}

/**
 * Gets the current version for a project
 * @param projectId - The ID of the project
 * @returns Promise<Version | null> - Returns the current version or null if not found
 */
export async function getCurrentVersionByProjectId(projectId: number) {
    try {
        const currentVersion = await db.query.versions.findFirst({
            where:
                eq(versions.projectId, projectId) &&
                eq(versions.isCurrent, true),
        });

        return currentVersion || null;
    } catch (error) {
        console.error("Error getting current version:", error);
        return null;
    }
}
export async function setCurrentVersionByAppId(
    appId: number,
    projectId: number,
): Promise<boolean> {
    try {
        const result = await db.transaction(async (tx) => {
            return await setCurrentVersionByAppIdWithTransaction(
                tx,
                appId,
                projectId,
            );
        });

        return result;
    } catch (error) {
        console.error("Error setting current version:", error);
        return false;
    }
}

/**
 * Internal function to set current version within an existing transaction
 * @param tx - The transaction context
 * @param appId - The ID of the app whose latest version should be set as current
 * @param projectId - The ID of the project to update versions for
 * @returns Promise<boolean> - Returns true if operation was successful
 */
export async function setCurrentVersionByAppIdWithTransaction(
    tx: any,
    appId: number,
    projectId: number,
): Promise<boolean> {
    try {
        // First, set all versions of this project to isCurrent = false
        await tx
            .update(versions)
            .set({ isCurrent: false })
            .where(eq(versions.projectId, projectId));

        // Find the latest version for this specific app
        const latestVersion = await tx.query.versions.findFirst({
            where: eq(versions.appId, appId),
            orderBy: [
                desc(versions.majorVersion),
                desc(versions.minorVersion),
                desc(versions.patchVersion),
                desc(versions.createdAt),
            ],
        });

        if (!latestVersion) {
            return false; // No version found for this app
        }

        // Set the latest version of this app as current
        await tx
            .update(versions)
            .set({ isCurrent: true })
            .where(eq(versions.id, latestVersion.id));

        return true;
    } catch (error) {
        console.error("Error setting current version in transaction:", error);
        return false;
    }
}

export async function updateVersionContent({
    versionId,
    content,
}: UpdateVersionContent) {
    try {
        const current = await db.query.versions.findFirst({
            where: eq(versions.id, versionId),
        });

        if (!current) {
            throw new Error("Version not found");
        }
        await db
            .update(versions)
            .set({
                content: content ?? current.content,
                updatedAt: new Date(),
            })
            .where(eq(versions.id, versionId));

        return { success: true };
    } catch (err: any) {
        console.error("Error updating version content:", err.message);
        return { success: false, message: err.message };
    }
}

export async function updateVersionPartsOnPublish(
    appId: number,
    updateType: "major" | "minor" | "patch" | "initialize",
) {
    const version = await db.query.versions.findFirst({
        where: eq(versions.appId, appId),
    });

    if (!version) {
        throw new Error("Version not found for this app");
    }

    let majorVersion = version.majorVersion;
    let minorVersion = version.minorVersion;
    let patchVersion = version.patchVersion;

    switch (updateType) {
        case "major":
            majorVersion += 1;
            minorVersion = 0;
            patchVersion = 0;
            break;
        case "minor":
            minorVersion += 1;
            patchVersion = 0;
            break;
        case "patch":
            patchVersion += 1;
            break;
        case "initialize":
            majorVersion = 1;
            minorVersion = 0;
            patchVersion = 0;
            break;
    }

    await db
        .update(versions)
        .set({
            majorVersion,
            minorVersion,
            patchVersion,
            updatedAt: new Date(),
        })
        .where(eq(versions.id, version.id));
}

export async function finalizeVersionNumberOnAccept(appId: number): Promise<boolean> {
    try {
        const version = await db.query.versions.findFirst({
            where: eq(versions.appId, appId),
        });

        if (!version) {
            return false;
        }

        // Safely default to 0 if any are null
        const majorVersion = version.majorVersion ?? 0;
        const minorVersion = version.minorVersion ?? 0;
        const patchVersion = version.patchVersion ?? 0;

        // Create the version string
        const versionNumber = `${majorVersion}.${minorVersion}.${patchVersion}`;

        // Update the version record
        await db
            .update(versions)
            .set({
                versionNumber,
                updatedAt: new Date(),
            })
            .where(eq(versions.id, version.id));

        return true;
    } catch (error) {
        console.error("Error finalizing version number:", error);
        return false;
    }
}

export async function revertVersionNumberOnReject(appId: number): Promise<boolean> {
    try {
        const version = await db.query.versions.findFirst({
            where: eq(versions.appId, appId),
        });

        if (!version || !version.versionNumber) {
            return false;
        }

        // Parse the version number string
        const versionParts = version.versionNumber.split('.');
        
        if (versionParts.length !== 3) {
            // Invalid version format, can't revert
            return false;
        }

        const majorVersion = parseInt(versionParts[0]) || 0;
        const minorVersion = parseInt(versionParts[1]) || 0;
        const patchVersion = parseInt(versionParts[2]) || 0;

        // Update the version record
        await db
            .update(versions)
            .set({
                majorVersion,
                minorVersion,
                patchVersion,
                updatedAt: new Date(),
            })
            .where(eq(versions.id, version.id));

        return true;
    } catch (error) {
        console.error("Error reverting version number:", error);
        return false;
    }
}