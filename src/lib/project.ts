import { projectMembers, projects } from "@/drizzle/schema";

export type ProjectJoinMembers = typeof projects.$inferSelect & {
    projectMembers: (typeof projectMembers.$inferSelect)[];
};

export enum ProjectRole {
    OWNER = "OWNER",
    MEMBER = "MEMBER",
    NONE = "NONE",
}

export const checkProjectRole = (
    userId: string,
    project: ProjectJoinMembers,
): {
    projectRole: ProjectRole;
    canEdit: boolean;
} => {
    let projectRole = ProjectRole.NONE;
    let canEdit = false;

    // if has project, check by membership of the project, if not found, check by ownership
    const isMember = project.projectMembers.some((member) => {
        if (member.userId === userId) {
            projectRole = ProjectRole.MEMBER;
            canEdit = member.canEdit ?? false;
            return true;
        }
    });

    if (isMember) {
        return { projectRole, canEdit };
    }

    if (project.userId === userId) {
        return { projectRole: ProjectRole.OWNER, canEdit: true };
    }

    return { projectRole, canEdit };
};
