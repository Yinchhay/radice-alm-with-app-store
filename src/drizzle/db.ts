import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import mysqlPool from "./connection";

declare global {
    var db: typeof dbInstance | undefined;
}

let dbInstance: MySql2Database<typeof schema>;

// Reuse the same connection in development to avoid creating multiple connections causing too many connections error
if (process.env.NODE_ENV === "production") {
    dbInstance = drizzle(mysqlPool, {
        schema,
        mode: "default",
    });
} else {
    if (!global.db) {
        global.db = drizzle(mysqlPool, {
            schema,
            mode: "default",
        });
    }

    dbInstance = global.db;
}

export { dbInstance as db };
