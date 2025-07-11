import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";
import DashboardLayout from "./_components/dashboard-layout";
import { AllPermissionsInTheSystem, userCanAccessRoute } from "@/lib/IAM";
import { hasPermission } from "@/lib/IAM";
import { cache } from "react";
import { UserType } from "@/types/user";
import { ThemeProvider } from "next-themes";
import { getUserRolesAndRolePermissions_C } from "@/repositories/users";
import React from 'react';
import { headers } from 'next/headers';
import DashboardResponsiveGuard from "./_components/dashboard-responsive-guard";

function isMobileUserAgent(userAgent: string | undefined) {
  if (!userAgent) return false;
  return /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

export type CanAccessRoutes = {
    manageUsers: boolean;
    manageRoles: boolean;
    managePartners: boolean;
    manageCategories: boolean;
    manageAllProjects: boolean;
    manageApplicationForms: boolean;
    manageMedia: boolean;
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

    if (user.type === UserType.USER && !user.hasLinkedGithub) {
        redirect("/link-oauth/github");
    }

    const { userPermissions } = await hasPermission(
        user.id,
        AllPermissionsInTheSystem,
        {
            checkAllRequiredPermissions: true,
        },
    );

    const canAccessRoutes = cache((): CanAccessRoutes => {
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
            manageAllProjects: true, // Always show All Projects for all users
            manageApplicationForms: userCanAccessRoute(
                "manageApplicationForms",
                userPermissions,
            ),
            manageMedia: userCanAccessRoute("manageMedia", userPermissions),
        };
    });

    const userWithRoles = await getUserRolesAndRolePermissions_C(user.id);
    // console.log(userWithRoles);

    return (
        <ThemeProvider enableSystem={false} attribute="class">
            <DashboardResponsiveGuard>
                <DashboardLayout
                    user={user}
                    canAccessRoutes={canAccessRoutes()}
                    userWithRoles={userWithRoles}
                >
                    {children}
                </DashboardLayout>
            </DashboardResponsiveGuard>
        </ThemeProvider>
    );
}
