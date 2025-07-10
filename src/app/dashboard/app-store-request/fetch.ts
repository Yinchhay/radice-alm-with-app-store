"use server";
import { db } from "@/drizzle/db";
import { apps, projects, appTypes } from "@/drizzle/schema";
import { eq, count } from "drizzle-orm";

export async function fetchPendingApps(page = 1, rowsPerPage = 5) {
  // Get total count (only pending apps)
  const totalRowsResult = await db
    .select({ count: count() })
    .from(apps)
    .where(eq(apps.status, "pending"));
  const totalRows = totalRowsResult[0]?.count || 0;

  // Get paginated data (only pending apps)
  const data = await db
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
    .where(eq(apps.status, "pending"))
    .limit(rowsPerPage)
    .offset((page - 1) * rowsPerPage);

  return { data, totalRows };
} 