import Card from "@/components/Card";
import Link from "next/link";
import { Suspense } from "react";
import { fetchRoleById, fetchUsersInRole } from "../../fetch";
import EditRole from "./edit_role";
import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { IconArrowLeft } from "@tabler/icons-react";
import Tooltip from "@/components/Tooltip";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
export const metadata: Metadata = {
    title: "Edit Role - Dashboard - Radice",
};
type Params = {
    role_id: string;
};

export default async function EditRoleById({ params }: { params: Params }) {
    const users = await getAuthUser();
    if (!users) {
        redirect("/login");
    }

    const [roleResult, usersInRoleResult, editRolePermission] =
        await Promise.all([
            await fetchRoleById(Number(params.role_id)),
            await fetchUsersInRole(Number(params.role_id)),
            await hasPermission(users.id, new Set([Permissions.EDIT_ROLES])),
        ]);

    if (!editRolePermission.canAccess) {
        redirect("/dashboard/roles");
    }

    if (!roleResult.success) {
        throw new Error(roleResult.message);
    }

    if (!usersInRoleResult.success) {
        throw new Error(usersInRoleResult.message);
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                {roleResult.data.role ? (
                    <div className="flex gap-4 flex-col">
                        <Tooltip title="Go back">
                            <Link href="/dashboard/roles">
                                <IconArrowLeft className="dark:text-white" />
                            </Link>
                        </Tooltip>
                        <DashboardPageTitle title="Edit Role" />
                        <Card>
                            <EditRole
                                key={roleResult.data.role.id}
                                role={roleResult.data.role}
                                usersInRole={usersInRoleResult.data.users}
                                user={users}
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
