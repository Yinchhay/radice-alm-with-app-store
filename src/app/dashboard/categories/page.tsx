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
import Pagination from "@/components/Pagination";
import { hasPermission } from "@/lib/IAM";
import { getAuthUser } from "@/auth/lucia";
import { Permissions } from "@/types/IAM";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";

type ManageCategoriesProps = {
    searchParams?: {
        page?: string;
    };
};

export default async function ManageCategories({
    searchParams,
}: ManageCategoriesProps) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchCategories(page, 5);
    if (!result.success) {
        throw new Error(result.message);
    }

    const [
        createCategoryPermission,
        editCategoryPermission,
        deleteCategoryPermission,
    ] = await Promise.all([
        hasPermission(user.id, new Set([Permissions.CREATE_CATEGORIES])),
        hasPermission(user.id, new Set([Permissions.EDIT_CATEGORIES])),
        hasPermission(user.id, new Set([Permissions.DELETE_CATEGORIES])),
    ]);

    const canCreateCategory = createCategoryPermission.canAccess;
    const canEditCategory = editCategoryPermission.canAccess;
    const canDeleteCategory = deleteCategoryPermission.canAccess;

    const CategoryLists = result.data.categories.map((category) => {
        return (
            <Category
                key={category.id}
                category={category}
                canEditCategory={canEditCategory}
                canDeleteCategory={canDeleteCategory}
            />
        );
    });

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                <h1 className="text-2xl">Category</h1>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Logo</ColumName>
                        <ColumName>Name</ColumName>
                        <ColumName>Description</ColumName>
                        <ColumName className="flex justify-end font-normal">
                            {canCreateCategory && <CreateCategoryOverlay />}
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {result.data.categories.length > 0 ? (
                            CategoryLists
                        ) : (
                            // TODO: style here
                            <NoCategory page={page} />
                        )}
                    </TableBody>
                </Table>
                {showPagination && (
                    <div className="float-right">
                        <Pagination page={page} maxPage={result.data.maxPage} />
                    </div>
                )}
            </Suspense>
        </div>
    );
}

function NoCategory({ page }: { page: number }) {
    return (
        <>
            <TableRow>
                <Cell>{`No category found in the system for page ${page}!`}</Cell>
            </TableRow>
        </>
    );
}

function Category({
    category,
    canEditCategory,
    canDeleteCategory,
}: {
    category: typeof categories.$inferSelect;
    canEditCategory: boolean;
    canDeleteCategory: boolean;
}) {
    return (
        <TableRow className="">
            <Cell data-test={`categoryLogo-${category.logo}`}>
                <ImageWithFallback
                    src={fileToUrl(category.logo)}
                    alt="category logo"
                    className="aspect-square object-cover rounded-sm"
                    width={128}
                    height={128}
                />
            </Cell>
            <Cell data-test={`categoryName-${category.name}`}>
                {category.name}
            </Cell>
            <Cell data-test={`categoryDescription-${category.description}`}>
                {category.description}
            </Cell>
            <Cell>
                <div
                    className="flex gap-2 justify-end"
                    key={category.id + new Date(category.updatedAt!).toISOString()}
                >
                    {canEditCategory && (
                        <EditCategoryOverlay category={category} />
                    )}
                    {canDeleteCategory && (
                        <DeleteCategoryOverlay category={category} />
                    )}
                </div>
            </Cell>
        </TableRow>
    );
}
