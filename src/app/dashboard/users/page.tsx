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
import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { UserWithoutPassword } from "../projects/[project_id]/settings/project_member";

export default async function ManageUsers() {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    const result = await fetchUsers();
    if (!result.success) {
        throw new Error(result.message);
    }

    const [createUserPermission, deleteUserPermission] = await Promise.all([
        hasPermission(user.id, new Set([Permissions.CREATE_USERS])),
        hasPermission(user.id, new Set([Permissions.DELETE_USERS])),
    ]);

    const canCreateUser = createUserPermission.canAccess;
    const canDeleteUser = deleteUserPermission.canAccess;

    const UserList = result.data.users.map((user) => {
        return <User key={user.id} user={user} canDeleteUser={canDeleteUser} />;
    });

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                <div>
                    <h1 className="text-2xl">Manage Users</h1>
                    <Table className="my-4 w-full">
                        <TableHeader>
                            <ColumName className="text-start">Name</ColumName>
                            <ColumName className="text-start">Email</ColumName>
                            <ColumName className="flex justify-end font-normal">
                                {canCreateUser && <CreateUserOverlay />}
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
        </div>
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

function User({
    user,
    canDeleteUser,
}: {
    user: UserWithoutPassword;
    canDeleteUser: boolean;
}) {
    return (
        <TableRow>
            <Cell data-test={`userName-${user.firstName}${user.lastName}`}>
                {user.firstName} {user.lastName}
            </Cell>
            <Cell data-test={`email-${user.email}`}>{user.email}</Cell>
            <Cell className="flex justify-end gap-2">
                {canDeleteUser && <DeleteUserOverlay user={user} />}
            </Cell>
        </TableRow>
    );
}
