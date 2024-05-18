import { projectMembers, projectPartners, projects } from "@/drizzle/schema";
import { UserType } from "@/types/user";

export type ProjectJoinMembersAndPartners = typeof projects.$inferSelect & {
    projectMembers: (typeof projectMembers.$inferSelect)[];
    projectPartners: (typeof projectPartners.$inferSelect)[];
};

export enum ProjectRole {
    SUPER_ADMIN = UserType.SUPER_ADMIN,
    OWNER = "owner",
    MEMBER = "member",
    PARTNER = "partner",
    NONE = "none",
}

export const checkProjectRole = (
    userId: string,
    project: ProjectJoinMembersAndPartners,
    userType: string,
): {
    projectRole: ProjectRole;
    canEdit: boolean;
} => {
    if (userType === UserType.SUPER_ADMIN) {
        return { projectRole: ProjectRole.SUPER_ADMIN, canEdit: true };
    }

    if (project.userId === userId) {
        return { projectRole: ProjectRole.OWNER, canEdit: true };
    }

    let projectRole = ProjectRole.NONE;
    let canEdit = false;

    const isMember = project.projectMembers?.some((member) => {
        if (member.userId === userId) {
            projectRole = ProjectRole.MEMBER;
            canEdit = member.canEdit ?? false;
            return true;
        }
    });

    if (isMember) {
        return { projectRole, canEdit };
    }

    const isPartner = project.projectPartners?.some((partner) => {
        if (partner.partnerId === userId) {
            projectRole = ProjectRole.PARTNER;
            canEdit = false;
            return true;
        }
    });

    if (isPartner) {
        return { projectRole, canEdit };
    }

    return { projectRole, canEdit };
};
