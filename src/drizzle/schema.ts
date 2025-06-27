/**
 * This file is the schema being used by drizzle-kit to generate the migrations to the database
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
    index 
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
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
    bugReports: many(bugReports),
    feedbacks: many(feedbacks),
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
    phoneNumber: varchar("phone_number", {
        length: 30,
    }),
    cvUrl: varchar("cv_url", {
        length: 2083,
    }),
    // Use 'approved' instead of 'status' to match DB
    approved: varchar("approved", {
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
    projectContent: json("project_content").default([]),
    links: json("links").$type<ProjectLink[]>().default([]),
    pipelineStatus: json("pipeline_status").$type<ProjectPipelineStatus>(),
    userId: varchar("user_id", {
        length: 255,
    }).references(() => users.id, {
        onDelete: "set null",
    }),
    isApp: boolean("is_app").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
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
// Create enum for feedback stars
export const starEnum = mysqlEnum('star_rating', ['1', '2', '3', '4', '5']);

// App Priority table
export const appPriority = mysqlTable('app_priority', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: varchar('description', { length: 500}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// App Types table
export const appTypes = mysqlTable('app_types', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: varchar('description', { length: 500}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Apps table
export const apps = mysqlTable('apps', {
id: int('id').primaryKey().autoincrement(),
  projectId: int('project_id').references(() => projects.id),
  subtitle: varchar('subtitle', { length: 255 }),
  type: int('type').references(() => appTypes.id),
  aboutDesc: varchar('about_desc', { length: 1000 }),
  content: text('content'),
  webUrl: varchar('web_url', { length: 500 }),
  appFile: varchar('app_file', { length: 500 }), // apk file
  status: text('status'), // 'pending', 'accepted', 'denied', 'archived'
  cardImage: varchar('card_image', { length: 500 }),
  bannerImage: varchar('banner_image', { length: 500 }),
  featuredPriority: int('featured_priority').references(() => appPriority.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Versions table
export const versions = mysqlTable('versions', {
  id: int('id').primaryKey().autoincrement(),
  appId: int('app_id').references(() => apps.id),
  versionNumber: varchar('version_number', { length: 50 }), // data: 1.0.0, 1.0.1, 1.1.0
  majorVersion: int('major_version'),
  minorVersion: int('minor_version'),
  patchVersion: int('patch_version'),
  isCurrent: boolean('is_current').default(false), // only one current version per app
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
},);

// Version Logs table
export const versionLogs = mysqlTable('version_logs', {
  id: int('id').primaryKey().autoincrement(),
  versionId: int('version_id').references(() => versions.id),
  action: varchar('action', { length: 50 }), // created, updated, activated, deactivated
  content: text('content'), // what changed in this version
  createdBy: int('created_by'), // user who made the change
  createdAt: timestamp('created_at').defaultNow(),
},);

// App Screenshots table
export const appScreenshots = mysqlTable('app_screenshots', {
  id: int('id').primaryKey().autoincrement(),
  appId: int('app_id').references(() => apps.id),
  imageUrl: varchar('image_url', { length: 500 }),
  sortOrder: int('sort_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Bug Reports table
export const bugReports = mysqlTable('bug_reports', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  video: varchar('video', { length: 500 }),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  appId: int('app_id').references(() => apps.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Feedbacks table
export const feedbacks = mysqlTable('feedbacks', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  appId: int('app_id').references(() => apps.id),
  title: varchar('title', { length: 255 }),
  review: text('review'),
  star: starEnum,
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Relations for RADICE App store
export const appPriorityRelations = relations(appPriority, ({ many }) => ({
  apps: many(apps),
}));

export const appTypesRelations = relations(appTypes, ({ many }) => ({
  apps: many(apps),
}));

export const appsRelations = relations(apps, ({ one, many }) => ({
  project: one(projects, {
    fields: [apps.projectId],
    references: [projects.id],
  }),
  appType: one(appTypes, {
    fields: [apps.type],
    references: [appTypes.id],
  }),
  priority: one(appPriority, {
    fields: [apps.featuredPriority],
    references: [appPriority.id],
  }),
  versions: many(versions),
  screenshots: many(appScreenshots),
  bugReports: many(bugReports),
  feedbacks: many(feedbacks),
}));

export const versionsRelations = relations(versions, ({ one, many }) => ({
  app: one(apps, {
    fields: [versions.appId],
    references: [apps.id],
  }),
  logs: many(versionLogs),
}));

export const versionLogsRelations = relations(versionLogs, ({ one }) => ({
  version: one(versions, {
    fields: [versionLogs.versionId],
    references: [versions.id],
  }),
}));

export const appScreenshotsRelations = relations(appScreenshots, ({ one }) => ({
  app: one(apps, {
    fields: [appScreenshots.appId],
    references: [apps.id],
  }),
}));

export const bugReportsRelations = relations(bugReports, ({ one }) => ({
  user: one(users, {
    fields: [bugReports.userId],
    references: [users.id],
  }),
  app: one(apps, {
    fields: [bugReports.appId],
    references: [apps.id],
  }),
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
  app: one(apps, {
    fields: [feedbacks.appId],
    references: [apps.id],
  }),
}));
