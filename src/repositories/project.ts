import { db } from "@/drizzle/db";
import { projectMembers, projectPartners, projects } from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { eq, sql, or, inArray, count } from "drizzle-orm";

export const createProject = async (project: typeof projects.$inferInsert) => {
    return await db.insert(projects).values(project);
};

export const memberAssociatedProjectIds = async (
    userId: string,
): Promise<number[]> => {
    const currentUserAssociatedProjects = await db
        .select({
            projectId: projectMembers.projectId,
        })
        .from(projectMembers)
        .where(eq(projectMembers.userId, userId));

    const memberIds = currentUserAssociatedProjects.map((p) => p.projectId);

    if (memberIds.length === 0) {
        // because inArray require at least one array, put -1 because in production, no project id start with -1.
        return [-1];
    }

    return memberIds;
};

export const partnerAssociatedProjectIds = async (
    partner_id: string,
): Promise<number[]> => {
    const currentPartnerAssociatedProjects = await db
        .select({
            projectId: projectPartners.projectId,
        })
        .from(projectPartners)
        .where(eq(projectPartners.partnerId, partner_id));

    const partnerIds = currentPartnerAssociatedProjects.map((p) => p.projectId);

    if (partnerIds.length === 0) {
        // because inArray require at least one array, put -1 because in production, no project id start with -1.
        return [-1];
    }

    return partnerIds;
};

// For pagination
export const getAssociatedProjectsTotalRowByUserId = async (userId: string) => {
    const memberIds = await memberAssociatedProjectIds(userId);
    const partnerIds = await partnerAssociatedProjectIds(userId);

    const totalRows = await db
        .select({ count: count() })
        .from(projects)
        .where(
            or(
                // check if the user is the owner of the project
                eq(projects.userId, userId),
                // if not, check if the user is associated with the project
                inArray(projects.id, memberIds),
                inArray(projects.id, partnerIds),
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
    const memberIds = await memberAssociatedProjectIds(userId);
    const partnerIds = await partnerAssociatedProjectIds(userId);

    return db.query.projects.findMany({
        where: (table, { or, inArray }) =>
            or(
                // check if the user is the owner of the project
                eq(table.userId, userId),
                // if not, check if the user is associated with the project
                inArray(table.id, memberIds),
                inArray(table.id, partnerIds),
            ),
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
            projectMembers: true,
            projectPartners: true,
        },
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export type OneAssociatedProject_C_Tag = `OneAssociatedProject_C_Tag`;
export async function getOneAssociatedProject(project_id: number) {
    const project = await db.query.projects.findFirst({
        where: (project, { eq }) => eq(project.id, Number(project_id)),
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
            projectMembers: {
                with: {
                    user: true,
                },
            },
            projectPartners: {
                with: {
                    partner: true,
                },
            },
            files: true,
        },
    });
    return project;
}

export async function editProjectContentById(
    project_id: number,
    chapters: string,
) {
    const updateResult = await db
        .update(projects)
        .set({ projectContent: chapters })
        .where(eq(projects.id, project_id));
    const updatedProject = await db.query.projects.findFirst({
        where: (project, { eq }) => eq(project.id, Number(project_id)),
        with: {
            projectMembers: true,
            projectPartners: true,
        },
    });
    return { updateSuccess: updateResult[0].affectedRows == 1, updatedProject };
}

export async function editProjectSettingDetailById(
    project_id: number,
    {
        name,
        description,
        logo,
    }: {
        name: string;
        description: string | null | undefined  ;
        logo: string | null;
    },
) {
    return await db
        .update(projects)
        .set({
            name: name,
            description: description,
            logoUrl: logo,
        })
        .where(eq(projects.id, project_id));
}