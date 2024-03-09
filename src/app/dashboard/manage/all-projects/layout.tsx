import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { redirect } from "next/navigation";

const requiredPermissions = new Set([
    Permissions.CHANGE_PROJECT_STATUS,
    Permissions.DELETE_PROJECTS,
]);

export default async function ManageAllProjectsLayout({
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
