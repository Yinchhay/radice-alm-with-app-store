import {
    editProjectSettingsMembers,
    editProjectSettingsPartners,
} from "@/app/api/internal/project/[project_id]/schema";
import { db } from "@/drizzle/db";
import {
    categories,
    projectCategories,
    ProjectLink,
    projectMembers,
    projectPartners,
    ProjectPipelineStatus,
    projects,
} from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { UserType } from "@/types/user";
import {
    eq,
    sql,
    or,
    inArray,
    count,
    and,
    getTableColumns,
    like,
    exists,
} from "drizzle-orm";
import { z } from "zod";

export const createProject = async (project: typeof projects.$inferInsert) => {
    return await db.insert(projects).values(project);
};

export const memberAssociatedProjectSubQuery = (userId: string) => {
    return db
        .select({
            projectId: projectMembers.projectId,
        })
        .from(projectMembers)
        .where(
            and(
                eq(projectMembers.userId, userId),
                eq(projectMembers.projectId, projects.id),
            ),
        );
};

export const partnerAssociatedProjectIds = (partner_id: string) => {
    return db
        .select({ projectId: projectPartners.projectId })
        .from(projectPartners)
        .where(
            and(
                eq(projectPartners.partnerId, partner_id),
                eq(projectPartners.projectId, projects.id),
            ),
        );
};

// For pagination
export const getAssociatedProjectsTotalRowByUserId = async (
    userId: string,
    search: string = "",
) => {
    const totalRows = await db
        .select({ count: count() })
        .from(projects)
        .where(
            and(
                or(
                    // check if the user is the owner of the project
                    eq(projects.userId, userId),
                    // if not, check if the user is associated with the project
                    exists(memberAssociatedProjectSubQuery(userId)),
                    exists(partnerAssociatedProjectIds(userId)),
                ),
                like(projects.name, `%${search}%`),
            ),
        );

    return totalRows[0].count;
};

export type GetProjects_C_Tag = `getProjects_C_Tag`;
export const getAssociatedProjectsByUserId = async (
    userId: string,
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return db.query.projects.findMany({
        where: (table, { or, inArray, and }) =>
            and(
                or(
                    // check if the user is the owner of the project
                    eq(table.userId, userId),
                    // if not, check if the user is associated with the project
                    exists(memberAssociatedProjectSubQuery(userId)),
                    exists(partnerAssociatedProjectIds(userId)),
                ),
                like(table.name, `%${search}%`),
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
                    user: {
                        columns: {
                            password: false,
                        },
                    },
                },
            },
            projectPartners: {
                with: {
                    partner: {
                        columns: {
                            password: false,
                        },
                    },
                },
            },
            files: true,
        },
    });
    return project;
}

export async function getProjectsForManageAllProjectsTotalRow(
    search: string = "",
) {
    const totalRows = await db
        .select({ count: count() })
        .from(projects)
        .where(like(projects.name, `%${search}%`));
    return totalRows[0].count;
}

export async function getProjectsForManageAllProjects(
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) {
    return await db.query.projects.findMany({
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
        },
        where: (table, { like }) => like(table.name, `%${search}%`),
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
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
    membersData: z.infer<typeof editProjectSettingsMembers>,
) {
    return await db.transaction(async (tx) => {
        if (membersData.membersToDelete) {
            for (const memberId of membersData.membersToDelete) {
                await tx
                    .delete(projectMembers)
                    .where(
                        and(
                            eq(projectMembers.projectId, projectId),
                            eq(projectMembers.userId, memberId),
                        ),
                    );
            }
        }
        if (membersData.membersToUpdate) {
            for (const member of membersData.membersToUpdate) {
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
        if (membersData.membersToAdd) {
            for (const member of membersData.membersToAdd) {
                const userTypeUser = await tx.query.users.findFirst({
                    where: (table, { eq, and }) =>
                        and(
                            eq(table.id, member.userId),
                            eq(table.type, UserType.USER),
                        ),
                });
                if (!userTypeUser) {
                    continue;
                }

                const isAlreadyMember = await tx.query.projectMembers.findFirst(
                    {
                        where: (table, { eq, and }) =>
                            and(
                                eq(table.projectId, projectId),
                                eq(table.userId, member.userId),
                            ),
                    },
                );

                if (isAlreadyMember) {
                    continue;
                }

                await tx.insert(projectMembers).values({
                    projectId: projectId,
                    userId: member.userId,
                    title: member.title ?? "",
                    canEdit: member.canEdit,
                });
            }
        }
    });
}

export async function editProjectSettingPartnersById(
    projectId: number,
    partnersData: z.infer<typeof editProjectSettingsPartners>,
) {
    return await db.transaction(async (tx) => {
        if (partnersData.partnersToDelete) {
            for (const partnerId of partnersData.partnersToDelete) {
                await tx
                    .delete(projectPartners)
                    .where(
                        and(
                            eq(projectPartners.projectId, projectId),
                            eq(projectPartners.partnerId, partnerId),
                        ),
                    );
            }
        }
        if (partnersData.partnersToAdd) {
            for (const partnerId of partnersData.partnersToAdd) {
                const userTypePartner = await tx.query.users.findFirst({
                    where: (table, { eq, and }) =>
                        and(
                            eq(table.id, partnerId),
                            eq(table.type, UserType.PARTNER),
                        ),
                });
                if (!userTypePartner) {
                    continue;
                }
                await tx.insert(projectPartners).values({
                    projectId: projectId,
                    partnerId: partnerId,
                });
            }
        }
    });
}

export async function updateProjectPublicStatus(
    projectId: number,
    isPublic: boolean,
) {
    return await db
        .update(projects)
        .set({ isPublic: isPublic })
        .where(eq(projects.id, projectId));
}

export async function updateProjectLinks(
    projectId: number,
    links: ProjectLink[],
) {
    return await db
        .update(projects)
        .set({ links: links })
        .where(eq(projects.id, projectId));
}

export async function updateProjectPipelineStatus(
    projectId: number,
    pipelines: ProjectPipelineStatus,
) {
    return await db
        .update(projects)
        .set({
            pipelineStatus: pipelines,
        })
        .where(eq(projects.id, projectId));
}

export async function getPublicProjectsByCategoryId(categoryId: number) {
    return await db.query.projects.findMany({
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
        },
        where: (table, { eq, exists, and }) =>
            and(
                eq(table.isPublic, true),
                exists(
                    db
                        .select()
                        .from(projectCategories)
                        .where(
                            and(
                                eq(projectCategories.categoryId, categoryId),
                                eq(projectCategories.projectId, table.id),
                            ),
                        ),
                ),
            ),
    });
}

export type ProjectFromCategory = Omit<
    typeof projects.$inferSelect,
    "updatedAt" | "createdAt"
>;
type Temp1 = Omit<typeof categories.$inferSelect, "updatedAt" | "createdAt">;
export type CategoryAndProjects = Temp1 & { projects: ProjectFromCategory[] };
// get public categories that have project is public true. get at least 1 project, if doesn't have, don't return the category
export async function getPublicProjectsByCategories() {
    const { createdAt, updatedAt, ...project } = getTableColumns(projects);
    const {
        createdAt: _,
        updatedAt: __,
        ...category
    } = getTableColumns(categories);
    const unstructured = await db
        .selectDistinct({
            category: category,
            project: project,
        })
        .from(categories)
        .innerJoin(
            projectCategories,
            eq(categories.id, projectCategories.categoryId),
        )
        .innerJoin(
            projects,
            and(
                eq(projectCategories.projectId, projects.id),
                eq(projects.isPublic, true),
            ),
        );

    // push category and then category has projects
    let categoriesStructure: CategoryAndProjects[] = [];

    for (const { category, project } of unstructured) {
        const categoryIndex = categoriesStructure.findIndex(
            (c) => c.id === category.id,
        );
        if (categoryIndex === -1) {
            categoriesStructure.push({
                ...category,
                projects: [project],
            });
        } else {
            categoriesStructure[categoryIndex].projects.push(project as any);
        }
    }

    return categoriesStructure;
}

export async function getPublicProjectsByUserId(userId: string) {
    return db.query.projects.findMany({
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
        },
        where: (table, { or, exists, and }) =>
            and(
                eq(table.isPublic, true),
                or(
                    // check if the user is the owner of the project
                    eq(table.userId, userId),
                    // if not, check if the user is associated with the project
                    exists(memberAssociatedProjectSubQuery(userId)),
                ),
            ),
    });
}

export async function getPublicProjectsByPartnerId(userId: string) {
    return db.query.projects.findMany({
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
        },
        where: (table, { or, exists, and }) =>
            and(
                eq(table.isPublic, true),
                or(
                    // check if the user is the owner of the project
                    eq(table.userId, userId),
                    // if not, check if the user is associated with the project
                    exists(partnerAssociatedProjectIds(userId)),
                ),
            ),
    });
}

export async function getProjectByIdForPublic(project_id: number) {
    return await db.query.projects.findFirst({
        where: (table, { eq, and }) =>
            and(eq(table.isPublic, true), eq(table.id, project_id)),
        with: {
            projectCategories: {
                with: {
                    category: true,
                },
            },
            projectMembers: {
                with: {
                    user: {
                        columns: {
                            password: false,
                        },
                    },
                },
            },
            projectPartners: {
                with: {
                    partner: {
                        columns: {
                            password: false,
                        },
                    },
                },
            },
            user: {
                columns: {
                    password: false,
                },
            },
        },
    });
}

export async function transferProjectOwnership(
    projectId: number,
    transferToUserId: string,
    ownerUserId: string | null,
) {
    // when transfer to another person, make the owner become member of the project
    return await db.transaction(async (tx) => {
        await tx
            .update(projects)
            .set({
                userId: transferToUserId,
            })
            .where(eq(projects.id, projectId));

        // if (ownerUserId) {
        //     await tx.insert(projectMembers).values({
        //         projectId: projectId,
        //         userId: ownerUserId,
        //         title: "",
        //         canEdit: false,
        //     });
        // }
    });
}
