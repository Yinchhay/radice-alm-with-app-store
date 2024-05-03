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
) : ProjectRole => {
    // if has project, check by membership of the project, if not found, check by ownership
    const isMember = project.projectMembers.some(
        (member) => member.userId === userId,
    );

    if (isMember) {
        return ProjectRole.MEMBER;
    }

    if (project.userId === userId) {
        return ProjectRole.OWNER;
    }

    return ProjectRole.NONE;
};
