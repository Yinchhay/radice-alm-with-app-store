import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { redirect } from "next/navigation";

const requiredPermissions = new Set([
    Permissions.CREATE_CATEGORIES,
    Permissions.EDIT_CATEGORIES,
    Permissions.DELETE_CATEGORIES,
]);

export default async function ManageCategoriesLayout({
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
        throw new Error("You don't have permission to access this page");
    }

    return <>{children}</>;
}
