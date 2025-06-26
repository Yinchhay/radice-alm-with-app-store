import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import {
    apps,
    projects,
    appTypes,
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

export const createApp = async (app: typeof apps.$inferInsert) => {
    return await db.insert(apps).values(app);
};

export const getAppByProjectId = async (projectId: number) => {
    const result = await db.select().from(apps).where(eq(apps.projectId, projectId));
    return result;
};

export async function getAppsForManageAllAppsTotalRow(
    search: string = "",
) {
    const totalRows = await db
        .select({ count: count() })
        .from(apps)
        .innerJoin(projects, eq(apps.projectId, projects.id))
        .where(like(projects.name, `%${search}%`));
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
        })
        .from(apps)
        .leftJoin(projects, eq(apps.projectId, projects.id))
        .leftJoin(appTypes, eq(apps.type, appTypes.id))
        .where(like(projects.name, `%${search}%`))
        .limit(rowsPerPage)
        .offset((page - 1) * rowsPerPage)
        .orderBy(sql`${apps.id} DESC`);
}