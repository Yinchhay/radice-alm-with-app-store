/**
 * RADICE Database Schema Migration
 * This file contains the complete database schema for the RADICE platform
 * Compatible with Drizzle ORM and Next.js
 */

import { relations } from "drizzle-orm";
import {
    mysqlTable,
    varchar,
    datetime,
    timestamp,
    int,
    boolean,
    json,
    text,
    mysqlEnum,
    unique,
    index,
    bigint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export enum FileBelongTo {
    PROJECT_SETTING = "project_setting",
    CONTENT_BUILDER = "content_builder",
    USER = "user",
    MEDIA = "media",
    CATEGORY = "category",
    APPLICATION_FORM = "application_form",
}

export enum AppStatus {
    DRAFT = "draft",
    PENDING = "pending",
    ACCEPTED = "accepted",
    DENIED = "denied",
}

export enum VersionAction {
    CREATED = "created",
    UPDATED = "updated",
    ACTIVATED = "activated",
    DEACTIVATED = "deactivated",
}

// Create star rating enum
export const starRatingEnum = mysqlEnum("star_rating", [
    "1",
    "2",
    "3",
    "4",
    "5",
]);

// ======================
// CORE USER TABLES
// ======================

/**
 * This file is the schema being used by drizzle-kit to generate the migrations
 */
import { z } from "zod";
import { projectPipeLineStatusType } from "@/app/api/internal/project/[project_id]/schema";
import { UserType } from "@/types/user";
import { skillSetSchema } from "@/app/api/internal/account/schema";

export enum UserProficienciesLevel {
    Know = 0,
    Do = 1,
    Teach = 2,
}
export const UserProficiencies: { [key in UserProficienciesLevel]: string } = {
    [UserProficienciesLevel.Know]: "Know",
    [UserProficienciesLevel.Do]: "Do",
    [UserProficienciesLevel.Teach]: "Teach",
};
export const UserProficiencyKeys = Object.values(UserProficiencies);

export type UserSkillSet = z.infer<typeof skillSetSchema>;

export const users = mysqlTable("users", {
    id: varchar("id", {
        length: 255,
    })
        .primaryKey()
        .default(sql`(uuid())`),
    firstName: varchar("first_name", {
        length: 50,
    }).notNull(),
    lastName: varchar("last_name", {
        length: 50,
    }).notNull(),
    email: varchar("email", {
        length: 255,
    })
        .notNull()
        .unique(),
    password: varchar("password", {
        length: 255,
    }).notNull(),
    phoneNumber: varchar("phone_number", {
        length: 30,
    }),
    isActive: boolean("is_active").default(true),
    hasLinkedGithub: boolean("has_linked_github").default(false),
    profileUrl: varchar("profile_url", {
        length: 255,
    }),
    type: varchar("type", {
        length: 50,
    })
        .notNull()
        .$type<UserType>()
        .default(UserType.USER),
    skillSet: json("skill_set").$type<UserSkillSet[]>().default([]),
    description: varchar("description", {
        length: 500,
    }),
    joinSince: timestamp("join_since").defaultNow(),
    leaveAt: timestamp("leave_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const userRelations = relations(users, ({ many, one }) => ({
    userRoles: many(userRoles),
    oauthProviders: many(oauthProviders),
    applicationForms: many(applicationForms),
    projects: many(projects),
    projectMembers: many(projectMembers),
    projectPartners: many(projectPartners),
    sessions: many(sessions),
    files: many(files),
    codeVerifications: many(codeVerifications),
}));

export const sessions = mysqlTable("sessions", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
    expiresAt: datetime("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const roles = mysqlTable("roles", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", {
        length: 50,
    })
        .notNull()
        .unique(),
    description: varchar("description", {
        length: 255,
    }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const roleRelations = relations(roles, ({ one, many }) => ({
    rolePermissions: many(rolePermissions),
    userRoles: one(userRoles, {
        fields: [roles.id],
        references: [userRoles.roleId],
    }),
}));

export const permissions = mysqlTable("permissions", {
    id: int("id").primaryKey(),
    name: varchar("name", {
        length: 50,
    })
        .notNull()
        .unique(),
    description: varchar("description", {
        length: 255,
    }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
    rolePermissions: many(rolePermissions),
}));

export const rolePermissions = mysqlTable("role_permissions", {
    id: int("id").primaryKey().autoincrement(),
    roleId: int("role_id")
        .notNull()
        .references(() => roles.id, {
            onDelete: "cascade",
        }),
    permissionId: int("permission_id")
        .notNull()
        .references(() => permissions.id, {
            onDelete: "cascade",
        }),
});

export const rolePermissionsRelations = relations(
    rolePermissions,
    ({ one }) => ({
        role: one(roles, {
            fields: [rolePermissions.roleId],
            references: [roles.id],
        }),
        permission: one(permissions, {
            fields: [rolePermissions.permissionId],
            references: [permissions.id],
        }),
    }),
);

export const userRoles = mysqlTable("user_roles", {
    id: int("id").primaryKey().autoincrement(),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
    roleId: int("role_id")
        .notNull()
        .references(() => roles.id, {
            onDelete: "cascade",
        }),
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    }),
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id],
    }),
}));

export const oauthProviders = mysqlTable("oauth_providers", {
    id: int("id").primaryKey().autoincrement(),
    providerId: varchar("provider_id", {
        length: 50,
    }).notNull(),
    providerUserId: varchar("provider_user_id", {
        length: 255,
    })
        .notNull()
        .unique(),
    accessToken: varchar("access_token", {
        length: 255,
    }),
    refreshToken: varchar("refresh_token", {
        length: 255,
    }),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const oauthProvidersRelations = relations(oauthProviders, ({ one }) => ({
    user: one(users, {
        fields: [oauthProviders.userId],
        references: [users.id],
    }),
}));

export enum CodeVerificationType {
    CHANGE_EMAIL = "change_email",
    VERIFY_NEW_EMAIL = "verify_new_email",
    FORGOT_PASSWORD = "forgot_password",
    CHANGE_GITHUB = "change_github",
}
export const codeVerifications = mysqlTable("code_verifications", {
    id: int("id").primaryKey().autoincrement(),
    code: varchar("code", {
        length: 255,
    })
        .notNull()
        .unique(),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
    type: varchar("type", {
        length: 100,
    })
        .notNull()
        .$type<CodeVerificationType>(),
    // store the pending change, for example, if the code is for change email, store the new email here
    pendingChange: varchar("pending_change", {
        length: 255,
    }),
    expiresAt: datetime("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const codeVerificationsRelations = relations(
    codeVerifications,
    ({ one }) => ({
        user: one(users, {
            fields: [codeVerifications.userId],
            references: [users.id],
        }),
    }),
);

export enum ApplicationFormStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
}
export const applicationForms = mysqlTable("application_forms", {
    id: int("id").primaryKey().autoincrement(),
    firstName: varchar("first_name", {
        length: 50,
    }).notNull(),
    lastName: varchar("last_name", {
        length: 50,
    }).notNull(),
    email: varchar("email", {
        length: 255,
    })
        .notNull()
        .unique(),
    reason: varchar("reason", {
        length: 5000,
    }).notNull(),
    cv: varchar("cv", {
        length: 2083,
    }).notNull(),
    status: varchar("approved", {
        length: 50,
    })
        .notNull()
        .$type<ApplicationFormStatus>()
        .default(ApplicationFormStatus.PENDING),
    reviewedByUserId: varchar("reviewed_by_user_id", {
        length: 255,
    }).references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const applicationFormsRelations = relations(
    applicationForms,
    ({ one }) => ({
        user: one(users, {
            fields: [applicationForms.reviewedByUserId],
            references: [users.id],
        }),
    }),
);

export const categories = mysqlTable("categories", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", {
        length: 50,
    })
        .notNull()
        .unique(),
    description: varchar("description", {
        length: 255,
    }),
    logo: varchar("logo", {
        length: 2083,
    }),
    // in case we want to disable some categories
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    projectCategories: many(projectCategories),
}));

export type ProjectLink = {
    link: string;
    title: string;
};
export type ProjectPipelineStatus = z.infer<typeof projectPipeLineStatusType>;
export const projects = mysqlTable("projects", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", {
        length: 50,
    })
        .notNull()
        .unique(),
    description: varchar("description", {
        length: 400,
    }),
    logoUrl: varchar("logo_url", {
        length: 2083,
    }),
    isPublic: boolean("is_public").notNull().default(false),
    isApp: boolean("is_app").notNull().default(false),
    projectContent: json("project_content").default([]),
    links: json("links").$type<ProjectLink[]>().default([]),
    pipelineStatus: json("pipeline_status").$type<ProjectPipelineStatus>(),
    userId: varchar("user_id", {
        length: 255,
    }).references(() => users.id, {
        // on delete allow delete user.
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
    projectCategories: many(projectCategories),
    projectMembers: many(projectMembers),
    projectPartners: many(projectPartners),
    files: many(files),
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
    apps: many(apps),
}));

export enum FileBelongTo {
    ProjectSetting = "project_setting",
    ContentBuilder = "content_builder",
    User = "user",
    Media = "media",
    Category = "category",
    ApplicationForm = "application_form",
}
export const files = mysqlTable("files", {
    id: int("id").primaryKey().autoincrement(),
    filename: varchar("filename", {
        length: 255,
    })
        .notNull()
        .unique(),
    size: varchar("size", {
        length: 50,
    }).notNull(),
    // use to identify the file belong to which entity so that user with permission can delete it
    belongTo: varchar("belong_to", {
        length: 50,
    }).$type<FileBelongTo>(),
    userId: varchar("user_id", {
        length: 255,
    }).references(() => users.id, {
        onDelete: "set null",
    }),
    // if project id is null, it mean that the file is not belong to a project
    projectId: int("project_id").references(() => projects.id, {
        // technically don't allow delete project
    }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const filesRelations = relations(files, ({ one }) => ({
    user: one(users, {
        fields: [files.userId],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [files.projectId],
        references: [projects.id],
    }),
}));

export const projectCategories = mysqlTable("project_categories", {
    id: int("id").primaryKey().autoincrement(),
    projectId: int("project_id")
        .notNull()
        .references(() => projects.id, {
            onDelete: "cascade",
        }),
    categoryId: int("category_id")
        .notNull()
        .references(() => categories.id, {
            onDelete: "cascade",
        }),
});

export const projectCategoriesRelations = relations(
    projectCategories,
    ({ one }) => ({
        project: one(projects, {
            fields: [projectCategories.projectId],
            references: [projects.id],
        }),
        category: one(categories, {
            fields: [projectCategories.categoryId],
            references: [categories.id],
        }),
    }),
);

export const projectMembers = mysqlTable("project_members", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", {
        length: 50,
    }).notNull(),
    canEdit: boolean("can_edit").default(false),
    projectId: int("project_id")
        .notNull()
        .references(() => projects.id, {
            onDelete: "cascade",
        }),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
    project: one(projects, {
        fields: [projectMembers.projectId],
        references: [projects.id],
    }),
    user: one(users, {
        fields: [projectMembers.userId],
        references: [users.id],
    }),
}));

export const projectPartners = mysqlTable("project_partners", {
    id: int("id").primaryKey().autoincrement(),
    projectId: int("project_id")
        .notNull()
        .references(() => projects.id, {
            onDelete: "cascade",
        }),
    // only for user type 'partner'
    partnerId: varchar("partner_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
});

export const projectPartnersRelations = relations(
    projectPartners,
    ({ one }) => ({
        project: one(projects, {
            fields: [projectPartners.projectId],
            references: [projects.id],
        }),
        partner: one(users, {
            fields: [projectPartners.partnerId],
            references: [users.id],
        }),
    }),
);

export type MediaFile = {
    filename: string;
};
export const media = mysqlTable("media", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", {
        length: 255,
    })
        .notNull()
        .unique(),
    description: varchar("description", {
        length: 2083,
    }),
    date: datetime("date").notNull(),
    files: json("files").$type<MediaFile[]>().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
// ======================
// APP STORE TABLES
// ======================

export const appTypes = mysqlTable("app_types", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    description: varchar("description", { length: 500 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const apps = mysqlTable("apps", {
    id: int("id").primaryKey().autoincrement(),
    projectId: int("project_id").references(() => projects.id),
    subtitle: varchar("subtitle", { length: 255 }),
    type: int("type").references(() => appTypes.id),
    aboutDesc: varchar("about_desc", { length: 1000 }),
    content: text("content"),
    webUrl: varchar("web_url", { length: 500 }),
    appFile: varchar("app_file", { length: 500 }), // APK file
    status: varchar("status", { length: 50 }).default(AppStatus.DRAFT),
    cardImage: varchar("card_image", { length: 500 }),
    bannerImage: varchar("banner_image", { length: 500 }),
    featuredPriority: boolean("featured_priority").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const versions = mysqlTable("versions", {
    id: int("id").primaryKey().autoincrement(),
    appId: int("app_id").references(() => apps.id, { onDelete: "set null" }),
    projectId: int("project_id").references(() => projects.id),
    versionNumber: varchar("version_number", { length: 50 }), // e.g., 1.0.0, 1.0.1, 1.1.0
    majorVersion: int("major_version").notNull(),
    minorVersion: int("minor_version").notNull(),
    patchVersion: int("patch_version").notNull(),
    isCurrent: boolean("is_current").default(false), // only one current version per project
    content: text("content"), // description of the version
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const appScreenshots = mysqlTable("app_screenshots", {
    id: int("id").primaryKey().autoincrement(),
    appId: int("app_id").references(() => apps.id, { onDelete: "cascade" }),
    imageUrl: varchar("image_url", { length: 500 }),
    sortOrder: int("sort_order").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ======================
// TESTING TABLES
// ======================

export const bugReports = mysqlTable("bug_reports", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    image: varchar("image", { length: 500 }),
    video: varchar("video", { length: 500 }),
    testerId: varchar("tester_id", { length: 255 }).references(
        () => testers.id,
        { onDelete: "cascade" },
    ),
    appId: int("app_id").references(() => apps.id, { onDelete: "cascade" }),
    projectId: int("project_id").references(() => projects.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const feedbacks = mysqlTable("feedbacks", {
    id: int("id").primaryKey().autoincrement(),
    testerId: varchar("tester_id", { length: 255 }).references(
        () => testers.id,
        { onDelete: "cascade" },
    ),
    appId: int("app_id").references(() => apps.id, { onDelete: "cascade" }),
    projectId: int("project_id").references(() => projects.id),
    title: varchar("title", { length: 255 }),
    review: text("review"),
    starRating: starRatingEnum,
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const testers = mysqlTable("testers", {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .default(sql`(uuid())`),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 30 }),
    profileUrl: varchar("profile_url", { length: 255 }),
    description: varchar("description", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ======================
// RELATIONS
// ======================

export const testerRelations = relations(testers, ({ many }) => ({
    bugReports: many(bugReports),
    feedbacks: many(feedbacks),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const permissionRelations = relations(permissions, ({ many }) => ({
    rolePermissions: many(rolePermissions),
}));

export const rolePermissionRelations = relations(
    rolePermissions,
    ({ one }) => ({
        role: one(roles, {
            fields: [rolePermissions.roleId],
            references: [roles.id],
        }),
        permission: one(permissions, {
            fields: [rolePermissions.permissionId],
            references: [permissions.id],
        }),
    }),
);

export const userRoleRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    }),
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id],
    }),
}));

// Auth Relations
export const oauthProviderRelations = relations(oauthProviders, ({ one }) => ({
    user: one(users, {
        fields: [oauthProviders.userId],
        references: [users.id],
    }),
}));

export const codeVerificationRelations = relations(
    codeVerifications,
    ({ one }) => ({
        user: one(users, {
            fields: [codeVerifications.userId],
            references: [users.id],
        }),
    }),
);

export const applicationFormRelations = relations(
    applicationForms,
    ({ one }) => ({
        reviewedBy: one(users, {
            fields: [applicationForms.reviewedByUserId],
            references: [users.id],
        }),
    }),
);

// Project Relations
export const categoryRelations = relations(categories, ({ many }) => ({
    projectCategories: many(projectCategories),
}));

export const projectRelations = relations(projects, ({ many, one }) => ({
    projectCategories: many(projectCategories),
    projectMembers: many(projectMembers),
    projectPartners: many(projectPartners),
    files: many(files),
    apps: many(apps),
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
}));

export const projectCategoryRelations = relations(
    projectCategories,
    ({ one }) => ({
        project: one(projects, {
            fields: [projectCategories.projectId],
            references: [projects.id],
        }),
        category: one(categories, {
            fields: [projectCategories.categoryId],
            references: [categories.id],
        }),
    }),
);

export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
    project: one(projects, {
        fields: [projectMembers.projectId],
        references: [projects.id],
    }),
    user: one(users, {
        fields: [projectMembers.userId],
        references: [users.id],
    }),
}));

export const projectPartnerRelations = relations(
    projectPartners,
    ({ one }) => ({
        project: one(projects, {
            fields: [projectPartners.projectId],
            references: [projects.id],
        }),
        partner: one(users, {
            fields: [projectPartners.partnerId],
            references: [users.id],
        }),
    }),
);

// File Relations
export const fileRelations = relations(files, ({ one }) => ({
    user: one(users, {
        fields: [files.userId],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [files.projectId],
        references: [projects.id],
    }),
}));

// App Store Relations
export const appTypeRelations = relations(appTypes, ({ many }) => ({
    apps: many(apps),
}));

export const appRelations = relations(apps, ({ one, many }) => ({
    project: one(projects, {
        fields: [apps.projectId],
        references: [projects.id],
    }),
    appType: one(appTypes, {
        fields: [apps.type],
        references: [appTypes.id],
    }),
    versions: many(versions),
    screenshots: many(appScreenshots),
    bugReports: many(bugReports),
    feedbacks: many(feedbacks),
}));

export const versionRelations = relations(versions, ({ one, many }) => ({
    app: one(apps, {
        fields: [versions.appId],
        references: [apps.id],
    }),
    project: one(projects, {
        fields: [versions.projectId],
        references: [projects.id],
    }),
}));

export const appScreenshotRelations = relations(appScreenshots, ({ one }) => ({
    app: one(apps, {
        fields: [appScreenshots.appId],
        references: [apps.id],
    }),
}));

// Testing Relations
export const bugReportRelations = relations(bugReports, ({ one }) => ({
    tester: one(testers, {
        fields: [bugReports.testerId],
        references: [testers.id],
    }),
    app: one(apps, {
        fields: [bugReports.appId],
        references: [apps.id],
    }),
    project: one(projects, {
        fields: [bugReports.id],
        references: [projects.id]
    }),
}));

export const feedbackRelations = relations(feedbacks, ({ one }) => ({
    tester: one(testers, {
        fields: [feedbacks.testerId],
        references: [testers.id],
    }),
    app: one(apps, {
        fields: [feedbacks.appId],
        references: [apps.id],
    }),
    project: one(projects, {
        fields: [feedbacks.id],
        references: [projects.id]
    }),
}));
