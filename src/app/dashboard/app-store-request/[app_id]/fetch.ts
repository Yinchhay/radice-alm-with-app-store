"use server";
import { db } from "@/drizzle/db";
import { apps, projects, appTypes, versions, appScreenshots } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

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
      subtitle: apps.subtitle,
      aboutDesc: apps.aboutDesc,
      type: apps.type,
      webUrl: apps.webUrl,
      featuredPriority: apps.featuredPriority,
      appFile: apps.appFile,
      cardImage: apps.cardImage,
      bannerImage: apps.bannerImage,
      // screenshots: fetch separately below
    })
    .from(apps)
    .leftJoin(projects, eq(apps.projectId, projects.id))
    .leftJoin(appTypes, eq(apps.type, appTypes.id))
    .where(eq(apps.id, Number(appId)));

  const appData = result[0] || null;
  if (!appData) return null;

  // Fetch the latest version for this app
  const versionResult = await db
    .select()
    .from(versions)
    .where(eq(versions.appId, Number(appId)))
    .orderBy(desc(versions.createdAt))
    .limit(1);

  // Fetch screenshots for this app
  const screenshotsResult = await db
    .select()
    .from(appScreenshots)
    .where(eq(appScreenshots.appId, Number(appId)));

  return {
    ...appData,
    whatsNew: versionResult[0]?.content || null,
    versionNumber: versionResult[0]?.versionNumber || null,
    updateType: versionResult[0]?.updateType || null,
    screenshots: screenshotsResult || [],
  };
} 