import { db } from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { count, eq, sql } from "drizzle-orm";

export const createCategory = async (
    category: typeof categories.$inferInsert,
) => {
    return await db.insert(categories).values(category);
};

export const deleteCategoryById = async (categoryId: number) => {
    return await db.delete(categories).where(eq(categories.id, categoryId));
};

export const editCategoryById = async (
    categoryId: number,
    category: typeof categories.$inferInsert,
) => {
    return await db
        .update(categories)
        .set({
            name: category.name,
            description: category.description,
            shortName: category.shortName,
            logo: category.logo,
        })
        .where(eq(categories.id, categoryId));
};

export type GetCategories_C_Tag = `getCategories_C`;
export const getCategories = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return await db.query.categories.findMany({
        where: (table, { like }) => like(table.name, `%${search}%`),
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export const getAllCategories = async () => {
    return await db.query.categories.findMany();
};

export const getCategoriesTotalRow = async () => {
    const totalRows = await db.select({ count: count() }).from(categories);
    return totalRows[0].count;
};
