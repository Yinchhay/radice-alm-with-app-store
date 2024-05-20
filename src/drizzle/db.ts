import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import connection from "./connection";

// export const db = drizzle(connection(), {
//     schema,
//     mode: "default",
// });

declare global {
    var db: typeof dbInstance | undefined;
}

let dbInstance = drizzle(connection(), {
    schema,
    mode: "default",
});

if (process.env.NODE_ENV === "production") {
    dbInstance = drizzle(connection(), {
        schema,
        mode: "default",
    });
} else {
    if (!global.db) {
        global.db = drizzle(connection(), {
            schema,
            mode: "default",
        });
    }
    dbInstance = global.db;
}

export { dbInstance as db };
