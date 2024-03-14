import { db } from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const createCategory = async (
    category: typeof categories.$inferInsert,
) => {
    return db.insert(categories).values(category);
};

export const deleteCategoryById = async (categoryId: number) => {
    return db.delete(categories).where(eq(categories.id, categoryId));
};

export const editCategory = async (
    categoryId: number,
    category: typeof categories.$inferInsert,
) => {
    return db
        .update(categories)
        .set({
            name: category.name,
            description: category.description,
        })
        .where(eq(categories.id, categoryId));
};

export type GetCategories_C_Tag = `getCategories_C`;
export const getCategories_C = cache(
    async () => {
        return db.query.categories.findMany();
    },
    [],
    {
        tags: ["getCategories_C"],
    },
);
