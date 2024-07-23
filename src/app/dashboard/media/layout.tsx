import { getAuthUser } from "@/auth/lucia";
import { hasPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { ErrorMessage } from "@/types/error";
import { redirect } from "next/navigation";

export default async function ManageMediasLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getAuthUser();
    if (!user) {
        return redirect("/login");
    }

    const userPermission = await hasPermission(
        user.id,
        RouteRequiredPermissions.get("manageMedia")!,
    );
    if (!userPermission.canAccess) {
        throw new Error(ErrorMessage.NoPermissionToThisPage);
    }

    return <>{children}</>;
}
