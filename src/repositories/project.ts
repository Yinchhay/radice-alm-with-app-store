import { db } from "@/drizzle/db";
import { projectMembers, projects, users } from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { eq, sql, or, inArray, count } from "drizzle-orm";

export const createProject = async (project: typeof projects.$inferInsert) => {
    return await db.insert(projects).values(project);
};

export const associatedProjectIds = async (
    userId: string,
): Promise<number[]> => {
    const currentUserAssociatedProjects = await db
        .select({
            projectId: projectMembers.projectId,
        })
        .from(projectMembers)
        .where(eq(projectMembers.userId, userId));

    return currentUserAssociatedProjects.map((p) => p.projectId);
};

// For pagination
export const getAssociatedProjectsTotalRowByUserId = async (userId: string) => {
    const currentUserAssociatedProjectIds = await associatedProjectIds(userId);

    const totalRows = await db
        .select({ count: count() })
        .from(projects)
        .where(
            or(
                // check if the user is the owner of the project
                eq(projects.userId, userId),
                // if not, check if the user is associated with the project
                inArray(
                    projects.id,
                    currentUserAssociatedProjectIds.length > 0
                        ? currentUserAssociatedProjectIds
                        : // because inArray require at least one array, put -1 because in production, no project id start with -1.
                          [-1],
                ),
            ),
        );

    return totalRows[0].count;
};

export type GetProjects_C_Tag = `getProjects_C_Tag`;
export const getAssociatedProjectsByUserId = async (
    userId: string,
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    const currentUserAssociatedProjectIds = await associatedProjectIds(userId);

    return db.query.projects.findMany({
        where: (table, { or, inArray }) =>
            or(
                // check if the user is the owner of the project
                eq(table.userId, userId),
                // if not, check if the user is associated with the project
                inArray(
                    table.id,
                    currentUserAssociatedProjectIds.length > 0
                        ? currentUserAssociatedProjectIds
                        : // because inArray require at least one array, put -1 because in production, no project id start with -1.
                          [-1],
                ),
            ),
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
            projectMembers: true,
        },
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};
