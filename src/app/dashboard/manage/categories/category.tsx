"use client";
import { categories } from "@/drizzle/schema";
import { DeleteCategory } from "./delete_category";

export function Category({
    category,
}: {
    category: typeof categories.$inferSelect;
}) {
    return (
        <>
            <div className="flex gap-8">
                <p>{category.name}</p>
                <p>{category.description}</p>
                <DeleteCategory category={category} />
            </div>
        </>
    );
}
