import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import Pagination from "@/components/Pagination";
import Button from "@/components/Button";
import { IconEdit } from "@tabler/icons-react";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import { roles } from "@/drizzle/schema";
import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";

import { CreateRoleOverlay } from "./create_role";
import { DeleteRoleOverlay } from "./delete_role";
import { fetchRoles } from "./fetch";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import NoRole from "./no_role";
import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
export const metadata: Metadata = {
    title: "Manage Roles - Dashboard - Radice",
};
type ManageRolesProps = {
    searchParams?: {
        page?: string;
        search?: string;
    };
};

export default async function ManageRoles({ searchParams }: ManageRolesProps) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }
    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchRoles(page, ROWS_PER_PAGE, searchParams?.search);

    if (!result.success) {
        throw new Error(result.message);
    }

    const [createRolePermission, editRolePermission, deleteRolePermission] =
        await Promise.all([
            hasPermission(user.id, new Set([Permissions.CREATE_ROLES])),
            hasPermission(user.id, new Set([Permissions.EDIT_ROLES])),
            hasPermission(user.id, new Set([Permissions.DELETE_ROLES])),
        ]);

    const canCreateRole = createRolePermission.canAccess;
    const canEditRole = editRolePermission.canAccess;
    const canDeleteRole = deleteRolePermission.canAccess;

    const RoleList = result.data.roles.map((role) => {
        return (
            <Role
                key={role.id}
                role={role}
                canEditRole={canEditRole}
                canDeleteRole={canDeleteRole}
            />
        );
    });

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                <div>
                    <DashboardPageTitle title="Roles" />
                    <div className="mt-4">
                        <SearchBar placeholder="Search roles" />
                    </div>
                    <Table className="my-4 w-full">
                        <TableHeader>
                            <ColumName className="text-start">Name</ColumName>
                            <ColumName className="flex justify-end font-normal">
                                {canCreateRole && <CreateRoleOverlay />}
                            </ColumName>
                        </TableHeader>
                        <TableBody>
                            {result.data.roles.length > 0 ? (
                                RoleList
                            ) : (
                                <NoRole page={page} />
                            )}
                        </TableBody>
                    </Table>
                    {showPagination && (
                        <div className="float-right  mb-4">
                            <Pagination
                                page={page}
                                maxPage={result.data.maxPage}
                            />
                        </div>
                    )}
                </div>
            </Suspense>
        </div>
    );
}

function Role({
    role,
    canEditRole,
    canDeleteRole,
}: {
    role: typeof roles.$inferSelect;
    canEditRole: boolean;
    canDeleteRole: boolean;
}) {
    return (
        <TableRow>
            <Cell data-test={`roleName-${role.name}`}>{role.name}</Cell>
            <Cell className="flex justify-end gap-2">
                {canEditRole && (
                    <Tooltip title="Edit role">
                        <Link href={`/dashboard/roles/edit/${role.id}`}>
                            <Button
                                data-test={`editRole-${role.name}`}
                                square={true}
                            >
                                <IconEdit></IconEdit>
                            </Button>
                        </Link>
                    </Tooltip>
                )}
                {canDeleteRole && <DeleteRoleOverlay role={role} />}
            </Cell>
        </TableRow>
    );
}
