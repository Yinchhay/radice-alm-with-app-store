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
import { ROWS_PER_PAGE } from "@/lib/pagination";
import Pagination from "@/components/Pagination";

type ManageCategoriesProps = {
    searchParams?: {
        page?: string;
    };
};

export default async function ManageCategories({
    searchParams,
}: ManageCategoriesProps) {
    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchCategories(page, ROWS_PER_PAGE);
    if (!result.success) {
        throw new Error(result.message);
    }

    const CategoryLists = result.data.categories.map((category) => {
        return <Category key={category.id} category={category} />;
    });

    const showPagination = result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <Suspense fallback={"loading..."}>
            <h1 className="text-2xl">Category</h1>
            <Table className="my-4 w-full">
                <TableHeader>
                    <ColumName>Name</ColumName>
                    <ColumName>Description</ColumName>
                    <ColumName className="flex justify-end">
                        <CreateCategoryOverlay />
                    </ColumName>
                </TableHeader>
                <TableBody>
                    {result.data.categories.length > 0 ? (
                        CategoryLists
                    ) : (
                        // TODO: style here
                        <NoCategory page={page}/>
                    )}
                </TableBody>
            </Table>
            {showPagination && (
                <div className="float-right">
                    <Pagination page={page} maxPage={result.data.maxPage} />
                </div>
            )}
        </Suspense>
    );
}

function NoCategory({ page}: { page: number }) {
    return (
        <>
            <TableRow>
                <Cell>{`No category found in the system for page ${page}!`}</Cell>
            </TableRow>
        </>
    );
}

function Category({ category }: { category: typeof categories.$inferSelect }) {
    return (
        <TableRow className="text-center align-middle">
            <Cell data-test={`categoryName-${category.name}`}>
                {category.name}
            </Cell>
            <Cell data-test={`categoryDescription-${category.description}`}>
                {category.description}
            </Cell>
            <Cell>
                <div className="flex gap-2 justify-end">
                    <EditCategoryOverlay category={category} />
                    <DeleteCategoryOverlay category={category} />
                </div>
            </Cell>
        </TableRow>
    );
}
