"use server";
import { db } from "@/drizzle/db";
import { projectCategories, projects } from "@/drizzle/schema";
import { eq, sql, or, inArray, count, and } from "drizzle-orm";

export async function getCategories() {
    const categories = await db.query.categories.findMany();
    return categories;
}

export async function getProjectsByCategory(categoryId: number) {}
