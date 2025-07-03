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

export async function getAllAcceptedApps(){
    try {
        const acceptedApps = await db.query.apps.findMany({
            where: eq(apps.status, "accepted"),
            with: {
                project: {
                    with: {
                        projectCategories: {
                            with: {
                                category: true
                            }
                        }
                    }
                },
                appType: true,
                priority: true,
                screenshots: true
            }
        });
        return acceptedApps.map(app => ({
            ...app,
            category: app.project?.projectCategories?.[0]?.category || null,
            projectCategories: app.project?.projectCategories?.[0] || null
        }))
        
    } catch (error) {
        console.error("Error fetching all accepted apps:", error);
        throw error;
    }
}