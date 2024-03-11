import { z } from "zod";
import { CreateCategoriesOverlay } from "./create_overlay";
import { min } from "drizzle-orm";

export const createCategoryFormSchema = z.object({
    name: z.string({
        required_error: "Category name is required",
    }).min(1, {
        message: "Category name is required"
    }),
    description: z.string({
        required_error: "Category description is required",
    }).min(1, {
        message: "Category description is required"
    }),
});

export default function ManageCategories() {
    // TODO: style here later
    return (
        <div>
            <h1>Manage Categories</h1>
            <div className="max-w-96">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold capitalize">Name</h2>
                    <CreateCategoriesOverlay />
                </div>
                <div className=""></div>
            </div>
        </div>
    );
}
