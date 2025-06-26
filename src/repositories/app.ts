import { db } from "@/drizzle/db";
import { apps } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const createApp = async (app: typeof apps.$inferInsert) => {
  return await db.insert(apps).values(app);
};

export const getAppByProjectId = async (projectId: number) => {
  const result = await db.select().from(apps).where(eq(apps.projectId, projectId));
  return result;
};