import Card from "@/components/Card";
import Link from "next/link";
import { Suspense } from "react";
import { fetchRoleById, fetchUsersInRole } from "../../fetch";
import EditRole from "./edit_role";

type Params = {
    role_id: string;
};

export default async function EditRoleById({ params }: { params: Params }) {
    const roleResult = await fetchRoleById(Number(params.role_id));
    if (!roleResult.success) {
        throw new Error(roleResult.message);
    }

    const usersInRoleResult = await fetchUsersInRole(Number(params.role_id));
    if (!usersInRoleResult.success) {
        throw new Error(usersInRoleResult.message);
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                {roleResult.data.role ? (
                    <div className="flex gap-4 flex-col">
                        <Link href="/dashboard/roles">Back</Link>
                        <h1 className="text-2xl">Edit role</h1>
                        <Card>
                            <EditRole
                                key={roleResult.data.role.id}
                                role={roleResult.data.role}
                                usersInRole={usersInRoleResult.data.users}
                            />
                        </Card>
                    </div>
                ) : (
                    <NoRole />
                )}
            </Suspense>
        </div>
    );
}

function NoRole() {
    return (
        <div className="flex flex-col items-center justify-between gap-4 my-8">
            <h1 className="text-lg">Role does not exist.</h1>
            <Link href="/dashboard/roles">Back</Link>
        </div>
    );
}
