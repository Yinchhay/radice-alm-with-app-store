import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import { CreateCategoryOverlay } from "./create_category";
import { EditCategoryOverlay } from "./edit_category";
import { DeleteCategoryOverlay } from "./delete_category";
import { fetchCategories } from "./fetch";
import { categories } from "@/drizzle/schema";

export default async function ManageCategories() {
    const result = await fetchCategories();
    if (!result.success) {
        throw new Error(result.message);
    }

    const CategoryList = result.data.categories.map((category) => {
        return <Category key={category.id} category={category} />;
    });

    return (
        <Suspense fallback={"loading..."}>
            <div>
                <h1>Manage Categories</h1>
                <Table>
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName>Description</ColumName>
                        <ColumName className="flex justify-end">
                            <CreateCategoryOverlay />
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {result.data.categories.length > 0 ? (
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
            <Cell data-test={`categoryName-${category.name}`}>
                {category.name}
            </Cell>
            <Cell data-test={`categoryDescription-${category.description}`}>
                {category.description}
            </Cell>
            <Cell className="flex gap-2">
                <EditCategoryOverlay category={category} />
                <DeleteCategoryOverlay category={category} />
            </Cell>
        </TableRow>
    );
}
