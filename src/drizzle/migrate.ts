import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "./db";

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: "src/drizzle/migrations" });
