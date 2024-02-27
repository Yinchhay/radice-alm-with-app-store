import { mysqlTable, varchar, datetime } from "drizzle-orm/mysql-core";

export const userTable = mysqlTable("user", {
    id: varchar("id", {
        length: 255
    }).primaryKey(),
    username: varchar("username", {
        length: 50
    }).notNull(),
});

export const sessionTable = mysqlTable("session", {
    id: varchar("id", {
        length: 255
    }).primaryKey(),
    userId: varchar("user_id", {
        length: 255
    })
        .notNull()
        .references(() => userTable.id),
    expiresAt: datetime("expires_at").notNull()
});