import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import connection from "./connection";

export const db = drizzle(connection(), {
    schema,
    mode: "default",
});
