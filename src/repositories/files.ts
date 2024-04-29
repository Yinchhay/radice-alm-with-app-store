import { db } from "@/drizzle/db";
import { files } from "@/drizzle/schema";

export const createFile = async (file: typeof files.$inferInsert) => {
    return await db.insert(files).values(file);
};