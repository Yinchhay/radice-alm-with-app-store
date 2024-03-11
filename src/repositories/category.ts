import { db } from "@/drizzle/db"
import { categories } from "@/drizzle/schema"

export const createCategory = async (category: typeof categories.$inferInsert) => {
    return db.insert(categories).values(category);
}