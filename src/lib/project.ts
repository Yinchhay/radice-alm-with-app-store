import { projectMembers, projects } from "@/drizzle/schema";
import { UserType } from "@/types/user";

export type ProjectJoinMembers = typeof projects.$inferSelect & {
    projectMembers: (typeof projectMembers.$inferSelect)[];
};

export enum ProjectRole {
    SUPER_ADMIN = UserType.SUPER_ADMIN,
    OWNER = "owner",
    MEMBER = "member",
    NONE = "none",
}

export const checkProjectRole = (
    userId: string,
    project: ProjectJoinMembers,
    userType: string,
): {
    projectRole: ProjectRole;
    canEdit: boolean;
} => {
    if (userType === UserType.SUPER_ADMIN) {
        return { projectRole: ProjectRole.SUPER_ADMIN , canEdit: true };
    }

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
