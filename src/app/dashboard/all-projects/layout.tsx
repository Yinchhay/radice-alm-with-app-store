import { getAuthUser } from "@/auth/lucia";
import { hasPermission, RouteRequiredPermissions } from "@/lib/IAM";
import { ErrorMessage } from "@/types/error";
import { redirect } from "next/navigation";

export default async function ManageAllProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getAuthUser();
    if (!user) {
        return redirect("/login");
    }

    // Permission check removed to allow all authenticated users

    return <>{children}</>;
}
