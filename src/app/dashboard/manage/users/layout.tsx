import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { redirect } from "next/navigation";

const requiredPermissions = new Set([
    Permissions.CREATE_USERS,
    Permissions.EDIT_USERS,
    Permissions.DELETE_USERS,
]);

export default async function ManageUsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getAuthUser();
    if (!user) {
        return redirect("/login");
    }

    const userPermission = await hasPermission(user.id, requiredPermissions);
    if (!userPermission.canAccess) {
        return redirect("/dashboard");
    }

    return <>{children}</>;
}
