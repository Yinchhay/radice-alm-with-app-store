import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { apps, projects, appTypes, projectCategories, categories } from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { UserType } from "@/types/user";
import {
    sql,
    or,
    inArray,
    count,
    and,
    getTableColumns,
    like,
    exists,
} from "drizzle-orm";
import { z } from "zod";

export const createApp = async (app: typeof apps.$inferInsert) => {
    return await db.insert(apps).values(app);
};

export const getAppByProjectId = async (projectId: number) => {
    const result = await db
        .select()
        .from(apps)
        .where(eq(apps.projectId, projectId));
    return result;
};

export async function getAppsForManageAllAppsTotalRow(search: string = "") {
    const totalRows = await db
        .select({ count: count() })
        .from(apps)
        .innerJoin(projects, eq(apps.projectId, projects.id))
        .where(
            and(
                like(projects.name, `%${search}%`),
                eq(projects.isPublic, true),
                eq(apps.status, "accepted")
            )
        );
    return totalRows[0].count;
}

export async function getAppsForManageAllApps(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) {
    return await db
        .select({
            app: apps,
            project: {
                id: projects.id,
                name: projects.name,
                logoUrl: projects.logoUrl,
                isPublic: projects.isPublic,
                userId: projects.userId,
            },
            appType: {
                id: appTypes.id,
                name: appTypes.name,
                description: appTypes.description,
            },
            projectCategories: {
                id: projectCategories.id,
                categoryId: projectCategories.categoryId,
            },
            category: {
                id: categories.id,
                name: categories.name,
                description: categories.description,
            },
        })
        .from(apps)
        .leftJoin(projects, eq(apps.projectId, projects.id))
        .leftJoin(appTypes, eq(apps.type, appTypes.id))
        .leftJoin(projectCategories, eq(projects.id, projectCategories.projectId))
        .leftJoin(categories, eq(projectCategories.categoryId, categories.id))
        .where(
            and(
                like(projects.name, `%${search}%`),
                eq(projects.isPublic, true),
                eq(apps.status, "accepted")
            )
        )
        .limit(rowsPerPage)
        .offset((page - 1) * rowsPerPage)
        .orderBy(sql`${apps.id} DESC`);
}

export async function getAppByIdForPublic(app_id: number) {
    return await db.query.apps.findFirst({
        where: (table, { eq, and }) =>
            and(eq(table.id, app_id), eq(table.status, "accepted")),

        columns: {
            id: true,
            subtitle: true,
            aboutDesc: true,
            content:true,
            webUrl: true,
            appFile: true,
            cardImage: true,
            bannerImage: true,
        },
        with: {

            project: {
                columns:{
                    name: true,
                    description: true,
                    isPublic: true,
                },
                with: {
                    projectMembers: {
                        with: {
                            user: {
                                columns: {
                                    password: false,
                                },
                            },
                        },
                    },
                },
            },

            screenshots: {
                columns: {
                    imageUrl: true,
                    sortOrder: true,
                },
            },

            versions: {
                columns: {
                    versionNumber: true,
                    majorVersion: true,
                    minorVersion: true,
                    patchVersion: true,
                },
            },

            appType: {
                columns: {
                    name: true,
                },
            },


        },
    });
}


export async function getAssociatedProjectsOfApp(appId: number) {
    return await db
        .select({
            project: projects,
        })
        .from(apps)
        .innerJoin(projects, eq(apps.projectId, projects.id))
        .where(eq(apps.id, appId));
}

export async function getAppWithAssociations(id: number) {
    try {
        const app = await db.query.apps.findFirst({
            where: (app, { eq }) => eq(app.id, id),
            with: {
                project: {
                    columns: {
                        id: true,
                        name: true,
                        isPublic: true,
                    },
                },
                appType: true,
                priority: true,
            },
        });

        return app || null;
    } catch (error) {
        console.error("Error fetching app with associations:", error);
        throw error;
    }
}

export async function editAppById(
    id: number,
    updateData: Partial<{
        subtitle: string;
        type: number;
        aboutDesc: string;
        content: string;
        webUrl: string;
        appFile: string;
        status: string;
        cardImage: string;
        bannerImage: string;
        featuredPriority: number;
    }>,
) {
    try {
        // Validate input
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new Error('Invalid app ID provided');
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            throw new Error('No update data provided');
        }

        const existingApp = await db.query.apps.findFirst({
            where: (app, { eq }) => eq(app.id, id),
        });

        if (!existingApp) {
            return {
                updateSuccess: false,
                updatedApp: null,
                error: 'App not found',
            };
        }

        const dataWithTimestamp = {
            ...updateData,
            updatedAt: new Date(),
        };

        await db
            .update(apps)
            .set(dataWithTimestamp)
            .where(eq(apps.id, id));

        const updatedApp = await db.query.apps.findFirst({
            where: (app, { eq }) => eq(app.id, id),
            with: {
                project: {
                    columns: {
                        id: true,
                        name: true,
                        isPublic: true,
                    },
                },
                appType: true,
                priority: true,
            },
        });

        if (!updatedApp) {
            return {
                updateSuccess: false,
                updatedApp: null,
                error: 'Failed to retrieve updated app',
            };
        }

        return {
            updateSuccess: true,
            updatedApp,
            error: null,
        };
    } catch (error) {
        console.error("Error editing app:", error);
        
        return {
            updateSuccess: false,
            updatedApp: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

export async function updateAppStatus(id: number, status: string) {
    try {
        await db
            .update(apps)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(apps.id, id));

        const updatedApp = await db.query.apps.findFirst({
            where: (app, { eq }) => eq(app.id, id),
        });

        return updatedApp || null;
    } catch (error) {
        console.error("Error updating app status:", error);
        throw error;
    }
}

export async function getAppById(id: number) {
    try {
        const app = await db.query.apps.findFirst({
            where: (app, { eq }) => eq(app.id, id),
        });

        return app || null;
    } catch (error) {
        console.error("Error fetching app by ID:", error);
        throw error;
    }
}