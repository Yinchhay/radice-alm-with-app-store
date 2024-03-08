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

export const users = mysqlTable("users", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
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
    }).notNull(),
    skillset: json("skillset").default({
        // todo: add default type so that we can infer the type of the object
    }),
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
    })
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

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id],
    }),
}));

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
    }).notNull(),
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
    }).notNull().unique(),
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

export const emailVerificationsRelations = relations(emailVerifications, ({ one }) => ({
    user: one(users, {
        fields: [emailVerifications.userId],
        references: [users.id],
    }),
}));

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

export const applicationFormsRelations = relations(applicationForms, ({ one }) => ({
    user: one(users, {
        fields: [applicationForms.reviewedByUserId],
        references: [users.id],
    }),
}));

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
    // in case we want to disable some categories
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    projectCategories: many(projectCategories),
}));

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
    is_public: boolean("is_public").default(false),
    // can be used to store 'links', 'files', 'chapters.components', 'pipline status'
    project_content: json("project_content").default({
        // todo: add default type so that we can infer the type of the object
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
    projectCategories: many(projectCategories),
    projectMembers: many(projectMembers),
    projectPartners: many(projectPartners),
    user: one(users, {
        fields: [projects.id],
        references: [users.id],
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

export const projectCategoriesRelations = relations(projectCategories, ({ one }) => ({
    project: one(projects, {
        fields: [projectCategories.projectId],
        references: [projects.id],
    }),
    category: one(categories, {
        fields: [projectCategories.categoryId],
        references: [categories.id],
    }),
}));

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

export const projectPartnersRelations = relations(projectPartners, ({ one }) => ({
    project: one(projects, {
        fields: [projectPartners.projectId],
        references: [projects.id],
    }),
    partner: one(users, {
        fields: [projectPartners.partnerId],
        references: [users.id],
    }),
}));