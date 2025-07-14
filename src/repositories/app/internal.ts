import { db } from "@/drizzle/db";
import { eq, desc, asc } from "drizzle-orm";
import {
    apps,
    projects,
    appTypes,
    categories,
    projectCategories,
} from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { sql, count, and, like } from "drizzle-orm";

export type AppWithRelations = {
    app: typeof apps.$inferSelect;
    project: {
        id: number;
        name: string;
        description: string | null;
        logoUrl: string | null;
        isPublic: boolean;
        userId: string;
    };
    appType: {
        id: number;
        name: string;
        description: string | null;
    } | null;
    categories: {
        id: number;
        name: string;
        description: string | null;
    }[];
};

export async function getAppWithAllRelations(
    appId: number,
): Promise<AppWithRelations | null> {
    try {
        const appData = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
            with: {
                project: {
                    columns: {
                        id: true,
                        name: true,
                        description: true,
                        logoUrl: true,
                        isPublic: true,
                        userId: true,
                    },
                },
                appType: true,
            },
        });

        if (!appData || !appData.project) return null;

        const projectCategoriesResult: {
            category: typeof categories.$inferSelect;
        }[] = await db
            .select({
                category: categories,
            })
            .from(projectCategories)
            .innerJoin(
                categories,
                eq(projectCategories.categoryId, categories.id),
            )
            .where(eq(projectCategories.projectId, appData.project.id));

        return {
            app: appData,
            project: {
                ...appData.project,
                isPublic: appData.project.isPublic ?? false,
                userId: appData.project.userId ?? "",
            },
            appType: appData.appType,
            categories: projectCategoriesResult.map((pc) => pc.category),
        };
    } catch (error) {
        console.error("Error fetching app with all relations:", error);
        throw error;
    }
}

export const createApp = async (app: typeof apps.$inferInsert) => {
    return await db.insert(apps).values(app);
};

// This function retrieves all apps associated with a specific project ID.
export async function getAppsByProjectId(projectId: number) {
    return await db.query.apps.findMany({
        where: (app, { eq }) => eq(app.projectId, projectId),
    });
}

export async function getAppsForManageAllAppsTotalRow(search: string = "") {
    const totalRows = await db
        .select({ count: count() })
        .from(apps)
        .innerJoin(projects, eq(apps.projectId, projects.id))
        .where(
            and(
                like(projects.name, `%${search}%`),
                eq(projects.isPublic, true),
                eq(apps.status, "accepted"),
            ),
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
        .leftJoin(
            projectCategories,
            eq(projects.id, projectCategories.projectId),
        )
        .leftJoin(categories, eq(projectCategories.categoryId, categories.id))
        .where(
            and(
                like(projects.name, `%${search}%`),
                eq(projects.isPublic, true),
            ),
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
            content: true,
            webUrl: true,
            appFile: true,
            cardImage: true,
            bannerImage: true,
            featuredPriority: true,
            type: true,
        },
        with: {
            project: {
                columns: {
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
        featuredPriority: boolean;
    }>,
) {
    try {
        if (!id || typeof id !== "number" || id <= 0) {
            throw new Error("Invalid app ID provided");
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            throw new Error("No update data provided");
        }

        const existingApp = await db.query.apps.findFirst({
            where: (app, { eq }) => eq(app.id, id),
        });

        if (!existingApp) {
            return {
                updateSuccess: false,
                updatedApp: null,
                error: "App not found",
            };
        }

        const dataWithTimestamp = {
            ...updateData,
            updatedAt: new Date(),
        };

        await db.update(apps).set(dataWithTimestamp).where(eq(apps.id, id));

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
            },
        });

        if (!updatedApp) {
            return {
                updateSuccess: false,
                updatedApp: null,
                error: "Failed to retrieve updated app",
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
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
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

export type ProjectJoinMembersAndPartners = {
    id: number;
    name: string;
    description: string | null;
    logoUrl: string | null;
    isPublic: boolean | null;
    projectContent: unknown;
    links: any[] | null;
    pipelineStatus: any | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    projectMembers: {
        id: number;
        createdAt: Date | null;
        updatedAt: Date | null;
        userId: string;
        projectId: number;
        title: string;
        canEdit: boolean | null;
    }[];
    projectPartners: {
        id: number;
        projectId: number;
        partnerId: string;
    }[];
};

export async function getAssociatedProjectsWithMembers(
    appId: number,
): Promise<ProjectJoinMembersAndPartners[]> {
    try {
        const result = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
            with: {
                project: {
                    with: {
                        projectMembers: true,
                        projectPartners: true,
                    },
                },
            },
        });

        if (!result || !result.project) {
            return [];
        }

        // Transform the result to match the expected type
        const projectWithMembers: ProjectJoinMembersAndPartners = {
            id: result.project.id,
            name: result.project.name,
            description: result.project.description,
            logoUrl: result.project.logoUrl,
            isPublic: result.project.isPublic,
            projectContent: result.project.projectContent,
            links: result.project.links,
            pipelineStatus: result.project.pipelineStatus,
            userId: result.project.userId,
            createdAt: result.project.createdAt,
            updatedAt: result.project.updatedAt,
            projectMembers: result.project.projectMembers || [],
            projectPartners: result.project.projectPartners || [],
        };

        return [projectWithMembers];
    } catch (error) {
        console.error(
            "Error fetching associated projects with members:",
            error,
        );
        throw error;
    }
}

export async function getAcceptedAppByProjectId(projectId: number) {
    const result = await db.query.apps.findFirst({
        where: and(eq(apps.projectId, projectId), eq(apps.status, "accepted")),
    });

    return result ?? undefined;
}

export async function updateAppFeaturedPriority(
    appId: number,
    featuredPriority: boolean,
) {
    try {
        await db
            .update(apps)
            .set({
                featuredPriority,
                updatedAt: new Date(),
            })
            .where(eq(apps.id, appId));

        const updatedApp = await db.query.apps.findFirst({
            where: eq(apps.id, appId),
        });

        return updatedApp || null;
    } catch (error) {
        console.error("Error updating app featured priority:", error);
        throw error;
    }
}