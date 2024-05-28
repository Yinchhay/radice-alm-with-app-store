import { getAuthUser } from "@/auth/lucia";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardLayout from "./_components/dashboard-layout";
import { AllPermissionsInTheSystem, userCanAccessRoute } from "@/lib/IAM";
import { hasPermission } from "@/lib/IAM";
import { cache } from "react";

export const metadata: Metadata = {
    title: "Dashboard | Radi Center",
    description: "Dashboard",
};

export type CanAccessRoutes = {
    manageUsers: boolean;
    manageRoles: boolean;
    managePartners: boolean;
    manageCategories: boolean;
    manageAllProjects: boolean;
    manageApplicationForms: boolean;
    manageMedias: boolean;
};

export default async function DashboardManageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // since middleware run on edge runtime, we cannot use getAuthUser() in middleware
    // so I use it here in the layout
    // - YatoRizzGod
    const user = await getAuthUser();
    if (!user) {
        redirect("/login");
    }

    const { userPermissions } = await hasPermission(
        user.id,
        AllPermissionsInTheSystem,
        {
            checkAllRequiredPermissions: true,
        },
    );

    const canAccessRoutes = cache(() => {
        return {
            manageUsers: userCanAccessRoute("manageUsers", userPermissions),
            manageRoles: userCanAccessRoute("manageRoles", userPermissions),
            managePartners: userCanAccessRoute(
                "managePartners",
                userPermissions,
            ),
            manageCategories: userCanAccessRoute(
                "manageCategories",
                userPermissions,
            ),
            manageAllProjects: userCanAccessRoute(
                "manageAllProjects",
                userPermissions,
            ),
            manageApplicationForms: userCanAccessRoute(
                "manageApplicationForms",
                userPermissions,
            ),
            manageMedias: userCanAccessRoute("manageMedias", userPermissions),
        };
    });

    return (
        <DashboardLayout user={user} canAccessRoutes={canAccessRoutes()}>
            {children}
        </DashboardLayout>
    );
}
