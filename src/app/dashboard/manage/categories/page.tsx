import { z } from "zod";
import { CreateCategoriesOverlay } from "./create_category";
import { getCategories_C } from "@/repositories/category";
import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import Button from "@/components/Button";
import { IconEdit } from "@tabler/icons-react";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import { categories } from "@/drizzle/schema";
import { DeleteCategory } from "./delete_category";

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
    const CategoryList = categories.map((category) => {
        return <Category key={category.id} category={category} />;
    });

    // TODO: style here later
    return (
        <Suspense fallback={"loading..."}>
            <div>
                <h1>Manage Categories</h1>
                <Table>
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName>Description</ColumName>
                        <ColumName className="flex justify-end">
                            <CreateCategoriesOverlay />
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {categories.length > 0 ? (
                            CategoryList
                        ) : (
                            // TODO: style here
                            <NoCategory />
                        )}
                    </TableBody>
                </Table>
            </div>
        </Suspense>
    );
}

function NoCategory() {
    return (
        <>
            <TableRow>
                <Cell>No category found in the system!</Cell>
            </TableRow>
        </>
    );
}

function Category({ category }: { category: typeof categories.$inferSelect }) {
    return (
        <TableRow>
            <Cell>{category.name}</Cell>
            <Cell>{category.description}</Cell>
            <Cell className="flex gap-2">
                <Button square={true}>
                    <IconEdit></IconEdit>
                </Button>
                <DeleteCategory category={category} />
            </Cell>
        </TableRow>
    );
}
