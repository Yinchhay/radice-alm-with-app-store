import { drizzle } from "drizzle-orm/mysql2"
import mysql, { ConnectionOptions } from "mysql2/promise"
import * as schema from "./migrations/schema"
import "@/lib/loadEnv"

export const connectionConfig: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "3306"),
    database: process.env.DB_DATABASE ?? "",
    user: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
}

export const connection = await mysql.createConnection(connectionConfig)

export const db = drizzle(connection, { schema, mode: "default" })
