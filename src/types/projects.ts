export interface ProjectMember {
    id: number;
    can_edit: boolean;
    project_id: number;
    user_id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    logoUrl?: string;
    isPublic?: boolean;
    userId?: number;
    projectMembers?: ProjectMember[];
}
