import { Project } from "./projects";

export enum AppType {
    WEB = "Web",
    API = "API",
    Mobile = "Mobile",
}
export interface App {
    id: number;
    projectId: number;
    subtitle: string;
    type: AppType | number;
    aboutDesc: string;
    content: string;
    webUrl?: string;
    appFile?: string;
    status?: string;
    cardImage?: string;
    bannerImage?: string;
    featuredPriority?: boolean;
    createdAt?: string;
    updatedAt?: string;
    project?: Project;
    appType?: { id: number; name: string; description?: string };
    screenshots?: { imageUrl: string; sortOrder: number }[];
    apiDocUrl?: string;
    category?: Category;
    projectCategories?: ProjectCategory;
}

export interface ProjectCategory {
    id: number;
    categoryId: number;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}
