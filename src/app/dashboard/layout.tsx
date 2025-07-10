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
            manageAllProjects: userCanAccessRoute(
                "manageAllProjects",
                userPermissions,
            ),
            manageApplicationForms: userCanAccessRoute(
                "manageApplicationForms",
                userPermissions,
            ),
            manageMedia: userCanAccessRoute("manageMedia", userPermissions),
        };
    });

    const userWithRoles = await getUserRolesAndRolePermissions_C(user.id);
    // console.log(userWithRoles);

    // SSR: get user-agent from headers
    const userAgent = headers().get('user-agent');
    const isMobile = isMobileUserAgent(userAgent);

    return (
        <ThemeProvider enableSystem={false} attribute="class">
            <DashboardLayout
                user={user}
                canAccessRoutes={canAccessRoutes()}
                userWithRoles={userWithRoles}
            >
                {isMobile ? (
                    <div
                        className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-center px-6 min-h-screen"
                        style={{ display: 'flex' }}
                    >
                        <div className="bg-white bg-opacity-90 text-black rounded-xl p-8 shadow-lg max-w-xs">
                            <h2 className="text-xl font-bold mb-4">Screen Too Small</h2>
                            <p className="mb-2">The dashboard is best experienced on a desktop or larger screen.</p>
                            <p>Please switch to a bigger device to access this page.</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {children}
                    </div>
                )}
            </DashboardLayout>
        </ThemeProvider>
    );
}
