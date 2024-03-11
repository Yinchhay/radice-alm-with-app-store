import { z } from "zod";
import { CreateCategoriesOverlay } from "./create_category";
import { getCategories_C } from "@/repositories/category";
import { Category } from "./category";
import { Suspense } from "react";

export const createCategoryFormSchema = z.object({
    name: z.string().min(1, {
        message: "Category name is required",
    }),
    description: z.string().min(1, {
        message: "Category description is required",
    }),
});

export const deleteCategoryFormSchema = z.object({
    categoryId: z
        .number({
            required_error: "Category id is required",
        })
        .positive({
            message: "Category id must be positive",
        }),
});

export default async function ManageCategories() {
    const categories = await getCategories_C();
    const categoryList = categories.map((category) => {
        return <Category key={category.id} category={category} />;
    });

    // TODO: style here later
    return (
        <Suspense fallback={"loading..."}>
            <div>
                <h1>Manage Categories</h1>
                <div className="max-w-96">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold capitalize">Name</h2>
                        <CreateCategoriesOverlay />
                    </div>
                    <div className="">
                        {categories.length > 0
                            ? categoryList
                            : "No category in the system"}
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
