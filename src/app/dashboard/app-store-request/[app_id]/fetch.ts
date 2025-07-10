"use server";
import { db } from "@/drizzle/db";
import { apps, projects, appTypes } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function fetchAppInfoByAppId(appId: string) {
  const result = await db
    .select({
      app: apps,
      project: {
        id: projects.id,
        name: projects.name,
      },
      appType: {
        id: appTypes.id,
        name: appTypes.name,
      },
    })
    .from(apps)
    .leftJoin(projects, eq(apps.projectId, projects.id))
    .leftJoin(appTypes, eq(apps.type, appTypes.id))
    .where(eq(apps.id, Number(appId)));

  return result[0] || null;
} 