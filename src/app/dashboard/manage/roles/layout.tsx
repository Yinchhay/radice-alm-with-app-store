import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { ErrorMessage } from "@/types/error";
import { redirect } from "next/navigation";

const requiredPermissions = new Set([
    Permissions.CREATE_ROLES,
    Permissions.EDIT_ROLES,
    Permissions.DELETE_ROLES,
]);

export default async function ManageRolesLayout({
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
        throw new Error(ErrorMessage.NoPermissionToThisPage);
    }

    return <>{children}</>;
}
