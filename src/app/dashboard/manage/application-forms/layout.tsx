import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { ErrorMessage } from "@/types/error";
import { redirect } from "next/navigation";

const requiredPermissions = new Set([
    Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS,
]);

export default async function ManageApplicationFormsLayout({
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
