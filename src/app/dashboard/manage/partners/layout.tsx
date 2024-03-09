import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { redirect } from "next/navigation";

const requiredPermissions = new Set([
    Permissions.CREATE_PARTNERS,
    Permissions.EDIT_PARTNERS,
    Permissions.DELETE_PARTNERS,
]);

export default async function ManagePartnersLayout({
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
