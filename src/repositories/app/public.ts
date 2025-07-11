import { db } from "@/drizzle/db";
import { eq, desc, asc } from "drizzle-orm";
import {
    apps,
    projects,
    appTypes,
    categories,
    projectCategories,
    appPriority,
} from "@/drizzle/schema";
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
    priority: {
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

export async function getAllAcceptedApps() {
    try {
        const acceptedApps = await db
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
            .leftJoin(
                categories,
                eq(projectCategories.categoryId, categories.id),
            )
            .where(and(eq(apps.status, "accepted"), eq(projects.isApp, true)))
            .orderBy(sql`${apps.id} DESC`);

        return acceptedApps;
    } catch (error) {
        console.error("Error fetching all accepted apps:", error);
        throw error;
    }
}
