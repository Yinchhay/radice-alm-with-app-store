/**
 * This file is the schema being used by drizzle-kit to generate the migrations
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
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { projectPipeLineStatusType } from "@/app/api/internal/project/[project_id]/schema";
import { UserType } from "@/types/user";

export enum UserSkillSetLevel {
    Know = "Know",
    Do = "Do",
    Teach = "Teach",
}
export type UserSkillSet = {
    label: string;
    level: UserSkillSetLevel;
};
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
    // type 'user', 'superadmin', 'partner'
    type: varchar("type", {
        length: 50,
    })
        .notNull()
        .$type<UserType>()
        .default(UserType.USER),
    skillSet: json("skillSet").$type<UserSkillSet[]>(),
    description: varchar("description", {
        length: 255,
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
    // one user can only have one email verification code
    emailVerification: one(emailVerifications, {
        fields: [users.id],
        references: [emailVerifications.userId],
    }),
}));

export const sessions = mysqlTable("sessions", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
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
        .references(() => roles.id),
    permissionId: int("permission_id")
        .notNull()
        .references(() => permissions.id),
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
        .references(() => users.id),
    roleId: int("role_id")
        .notNull()
        .references(() => roles.id),
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
        .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const oauthProvidersRelations = relations(oauthProviders, ({ one }) => ({
    user: one(users, {
        fields: [oauthProviders.userId],
        references: [users.id],
    }),
}));

export const emailVerifications = mysqlTable("email_verifications", {
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
        .references(() => users.id)
        .unique(),
    expiresAt: datetime("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const emailVerificationsRelations = relations(
    emailVerifications,
    ({ one }) => ({
        user: one(users, {
            fields: [emailVerifications.userId],
            references: [users.id],
        }),
    }),
);

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
    reviewedByUserId: varchar("reviewed_by_user_id", {
        length: 255,
    }).references(() => users.id),
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
    shortName: varchar("short_name", {
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
        length: 255,
    }),
    logoUrl: varchar("logo_url", {
        length: 2083,
    }),
    isPublic: boolean("is_public").default(false),
    projectContent: json("project_content"),
    links: json("links").$type<ProjectLink[]>(),
    pipelineStatus: json("pipeline_status").$type<ProjectPipelineStatus>(),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
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
}));

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
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
    // if project id is null, it mean that the file is not belong to a project
    projectId: int("project_id").references(() => projects.id),
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
        .references(() => projects.id),
    categoryId: int("category_id")
        .notNull()
        .references(() => categories.id),
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
        .references(() => projects.id),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
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
        .references(() => projects.id),
    // only for user type 'partner'
    partnerId: varchar("partner_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
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
