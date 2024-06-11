import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import mysql, { ConnectionOptions } from "mysql2";

export const connectionConfig: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "3306"),
    database: process.env.DB_DATABASE ?? "",
    user: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
};

if (
    !connectionConfig.host ||
    !connectionConfig.port ||
    !connectionConfig.database ||
    !connectionConfig.user ||
    !connectionConfig.password
) {
    throw new Error("Invalid connection configuration");
}

// Singleton function to ensure only one db instance is created
function singleton<Value>(name: string, value: () => Value): Value {
    const globalAny: any = global;
    globalAny.__singletons = globalAny.__singletons || {};

    if (!globalAny.__singletons[name]) {
        globalAny.__singletons[name] = value();
    }

    return globalAny.__singletons[name];
}

export function createDatabaseConnection() {
    const poolConnection = mysql.createPool(connectionConfig);
    return drizzle(poolConnection, {
        schema,
        mode: "default",
    });
}

const db = singleton("db", createDatabaseConnection);

export { db, schema };
