import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import { CreateRoleOverlay } from "./create_role";
import { IconEdit } from "@tabler/icons-react";

import { DeleteRoleOverlay } from "./delete_role";
import { fetchRoles } from "./fetch";
import { roles } from "@/drizzle/schema";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import Pagination from "@/components/Pagination";
import Button from "@/components/Button";

type ManageRolesProps = {
    searchParams?: {
        page?: string;
    };
};

export default async function ManageRoles({ searchParams }: ManageRolesProps) {
    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchRoles(page, ROWS_PER_PAGE);

    if (!result.success) {
        throw new Error(result.message);
    }

    const RoleList = result.data.roles.map((role) => {
        return <Role key={role.id} role={role} />;
    });

    return (
        <Suspense fallback={"loading..."}>
            <div>
                <h1>Manage Roles</h1>
                <Table>
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName className="flex justify-end">
                            <CreateRoleOverlay />
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {result.data.roles.length > 0 ? (
                            RoleList
                        ) : (
                            // TODO: style here
                            <NoRole />
                        )}
                    </TableBody>
                </Table>
                {result.data.maxPage > 1 && (
                    <Pagination page={page} maxPage={result.data.maxPage} />
                )}
            </div>
        </Suspense>
    );
}

function NoRole() {
    return (
        <>
            <TableRow>
                <Cell>No role found in the system!</Cell>
            </TableRow>
        </>
    );
}

function Role({ role }: { role: typeof roles.$inferSelect }) {
    return (
        <TableRow>
            <Cell data-test={`roleName-${role.name}`}>{role.name}</Cell>
            <Cell className="flex gap-2">
                <a href={`/dashboard/roles/edit/${role.id}`}>
                    <Button data-test={`editRole-${role.name}`} square={true}>
                        <IconEdit></IconEdit>
                    </Button>
                </a>
                {/* <EditRoleOverlay role={role} /> */}
                <DeleteRoleOverlay role={role} />
            </Cell>
        </TableRow>
    );
}
