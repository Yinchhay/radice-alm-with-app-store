import { db } from "@/drizzle/db";
import { projectCategories } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function createProjectCategory(
    projectId: number,
    categoryId: number,
) {
    return await db.insert(projectCategories).values({
        projectId,
        categoryId,
    });
}

export async function deleteProjectCategory(projectCategoryId: number) {
    return await db
        .delete(projectCategories)
        .where(eq(projectCategories.id, projectCategoryId));
}
