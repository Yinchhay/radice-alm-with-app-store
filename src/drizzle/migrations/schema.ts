import { sql } from "drizzle-orm";
import { mysqlTable, varchar, datetime, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
    username: varchar("username", {
        length: 50,
    }).notNull(),
    password: varchar("password", {
        length: 255,
    }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

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
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});
