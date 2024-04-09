import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import { CreateRoleOverlay } from "./create_role";
import { EditRoleOverlay } from "./edit_role";
import { DeleteRoleOverlay } from "./delete_role";
import { fetchRoles } from "./fetch";
import { roles } from "@/drizzle/schema";

export default async function ManageRoles() {
    const result = await fetchRoles();
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
                <EditRoleOverlay role={role} />
                <DeleteRoleOverlay role={role} />
            </Cell>
        </TableRow>
    );
}
