import { db } from "@/drizzle/db";
import {
    projectCategories,
    projectMembers,
    projectPartners,
    projects,
} from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { UserType } from "@/types/user";
import { eq, sql, or, inArray, count, and } from "drizzle-orm";

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
        categoriesToBeAdded,
        projectCategoriesToBeDeleted,
    }: {
        name: string;
        description: string | null | undefined;
        logo: string | null;
        categoriesToBeAdded: number[];
        projectCategoriesToBeDeleted: number[];
    },
) {
    return await db.transaction(async (tx) => {
        // create categories
        for (const categoryId of categoriesToBeAdded) {
            await tx.insert(projectCategories).values({
                projectId: project_id,
                categoryId: categoryId,
            });
        }

        // delete categories
        for (const projectCategoriesId of projectCategoriesToBeDeleted) {
            await tx
                .delete(projectCategories)
                .where(eq(projectCategories.id, projectCategoriesId));
        }

        // update project details
        return await tx
            .update(projects)
            .set({
                name: name,
                description: description,
                logoUrl: logo,
            })
            .where(eq(projects.id, project_id));
    });
}

export async function editProjectSettingMembersById(
    projectId: number,
    membersToUpdate: {
        userId: string;
        title?: string | undefined;
        canEdit: boolean;
    }[],
) {
    return await db.transaction(async (tx) => {
        let arrayOfUsers = membersToUpdate.map((member) => member.userId);
        if (arrayOfUsers.length === 0) {
            // because inArray require at least one array, put any value because in production,
            arrayOfUsers = ["-1asdsada"];
        }

        const usersInDb = await tx.query.users.findMany({
            where: (user, { inArray }) => inArray(user.id, arrayOfUsers),
        });

        const projectMembersInDb = await tx.query.projectMembers.findMany({
            where: (projectMember, { eq }) =>
                eq(projectMember.projectId, projectId),
        });

        /**
         * 1. If the user is not in the projectMembersInDb, insert the user but user type must be user
         * 2. If the user is in the projectMembersInDb, update the user
         * 3. If project member is not in the membersToUpdate, delete the project member
         */

        // delete project member
        for (const projectMember of projectMembersInDb) {
            const projectMemberNotInMembersToUpdate = !membersToUpdate.find(
                (m) => m.userId === projectMember.userId,
            );
            if (projectMemberNotInMembersToUpdate) {
                await tx
                    .delete(projectMembers)
                    .where(
                        and(
                            eq(projectMembers.projectId, projectId),
                            eq(projectMembers.userId, projectMember.userId),
                        ),
                    );
            }
        }

        for (const member of membersToUpdate) {
            const user = usersInDb.find((u) => u.id === member.userId);

            const projectMember = projectMembersInDb.find(
                (pm) => pm.userId === member.userId,
            );

            if (!projectMember) {
                if (!user) {
                    continue;
                }

                if (user.type !== UserType.USER) {
                    continue;
                }

                // create project member
                await tx.insert(projectMembers).values({
                    projectId: projectId,
                    userId: member.userId,
                    title: member.title || "",
                    canEdit: member.canEdit,
                });
            } else {
                // update project member
                await tx
                    .update(projectMembers)
                    .set({
                        title: member.title,
                        canEdit: member.canEdit,
                    })
                    .where(
                        and(
                            eq(projectMembers.projectId, projectId),
                            eq(projectMembers.userId, member.userId),
                        ),
                    );
            }
        }
    });
}
