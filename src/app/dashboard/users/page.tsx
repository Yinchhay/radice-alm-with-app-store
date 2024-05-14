import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import { CreateUserOverlay } from "./create_user";
import { DeleteUserOverlay } from "./delete_user";
import { fetchUsers } from "./fetch";
import { users } from "@/drizzle/schema";

export default async function ManageUsers() {
    const result = await fetchUsers();
    if (!result.success) {
        throw new Error(result.message);
    }

    const UserList = result.data.users.map((user) => {
        return <User key={user.id} user={user} />;
    });

    return (
        <Suspense fallback={"loading..."}>
            <div>
                <h1 className="text-2xl">Manage Users</h1>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName className="text-start">Name</ColumName>
                        <ColumName className="text-start">Email</ColumName>
                        <ColumName className="flex justify-end">
                            <CreateUserOverlay />
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {result.data.users.length > 0 ? (
                            UserList
                        ) : (
                            // TODO: style here
                            <NoUser />
                        )}
                    </TableBody>
                </Table>
            </div>
        </Suspense>
    );
}

function NoUser() {
    return (
        <>
            <TableRow>
                <Cell>No user found in the system!</Cell>
            </TableRow>
        </>
    );
}

function User({ user }: { user: typeof users.$inferSelect }) {
    return (
        <TableRow>
            <Cell data-test={`userName-${user.firstName}${user.lastName}`}>
                {user.firstName} {user.lastName}
            </Cell>
            <Cell data-test={`email-${user.email}`}>{user.email}</Cell>
            <Cell className="flex justify-end gap-2">
                <DeleteUserOverlay user={user} />
            </Cell>
        </TableRow>
    );
}
