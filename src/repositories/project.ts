import { db } from "@/drizzle/db";
import { projects } from "@/drizzle/schema";

export const createProject = async (project: typeof projects.$inferInsert) => {
    return await db.insert(projects).values(project);
};

export type GetProjects_C_Tag = `getProjects_C_Tag`;