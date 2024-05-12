import { db } from "@/drizzle/db";
import { projectMembers, projects, users } from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { eq, sql, or, desc, inArray } from "drizzle-orm";

export const createProject = async (project: typeof projects.$inferInsert) => {
    return await db.insert(projects).values(project);
};

// For pagination
export const getAssociatedProjectsTotalRowByUserId = async (userId: string) => {
    const currentUserAssociatedProjects = await db
        .select({
            projectId: projectMembers.projectId,
        })
        .from(projectMembers)
        .where(eq(projectMembers.userId, userId));

    const associatedProjectIdArray = currentUserAssociatedProjects.map(
        (p) => p.projectId,
    );

    const totalRows = await db
        .select()
        .from(projects)
        .leftJoin(projectMembers, eq(projectMembers.projectId, projects.id))
        .where(
            or(
                // check if the user is the owner of the project
                eq(projects.userId, userId),
                // if not, check if the user is associated with the project
                inArray(projects.id, associatedProjectIdArray),
            ),
        );

    // remove duplicate projects
    const uniqueProjects = totalRows.filter((project, index, self) => {
        return index === self.findIndex((p) => p.projects.id === project.projects.id);
    });

    return uniqueProjects.length;
};

export type GetProjects_C_Tag = `getProjects_C_Tag`;
/**
 * raw SQL query if raw sql test is needed
 * SELECT * FROM projects AS p
 * LEFT JOIN project_members AS pm ON pm.project_id = p.id
 * WHERE p.user_id = 'userId' OR
 * p.id = (SELECT project_id FROM project_members WHERE project_members.user_id = 'userId')
 * LIMIT rowsPerPage
 * OFFSET (page - 1) * rowsPerPage
 * ORDER BY p.created_at DESC
 */
export const getAssociatedProjectsByUserId = async (
    userId: string,
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    // using raw query because drizzle query builder is limited with what we need
    const currentUserAssociatedProjects = await db
        .select({
            projectId: projectMembers.projectId,
        })
        .from(projectMembers)
        .where(eq(projectMembers.userId, userId));

    const associatedProjectIdArray = currentUserAssociatedProjects.map(
        (p) => p.projectId,
    );

    const projectsRaw = await db
        .select()
        .from(projects)
        .leftJoin(projectMembers, eq(projectMembers.projectId, projects.id))
        // .leftJoin(users, eq(users.id, projectMembers.userId))
        .where(
            or(
                // check if the user is the owner of the project
                eq(projects.userId, userId),
                // if not, check if the user is associated with the project
                inArray(projects.id, associatedProjectIdArray),
            ),
        )
        .limit(rowsPerPage)
        .offset((page - 1) * rowsPerPage)
        .orderBy(desc(projects.createdAt));

    // structure the projects data to look like drizzle builder query result
    const projectStructured = projectsRaw
        .map((project) => {
            // get all current project members
            const projectMembers = projectsRaw
                .filter((p) => p.projects.id === project.projects.id)
                .map((p) => p.project_members);

            // return the project with the project members
            return {
                ...project.projects,
                projectMembers,
            };
            // remove duplicate projects
        })
        .filter(
            (project, index, self) =>
                index === self.findIndex((p) => p.id === project.id),
        );

    return projectStructured;
};
