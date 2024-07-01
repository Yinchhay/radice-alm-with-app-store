"use client";
import { useState } from "react";
import Navbar from "./navbar";
import SideNav from "./sidenav";
import { User } from "lucia";
import { CanAccessRoutes } from "../layout";
import { GetUserRolesAndRolePermissions_C_ReturnType } from "@/repositories/users";

export default function DashboardLayout({
    children,
    user,
    canAccessRoutes,
    userWithRoles,
}: {
    user: User;
    userWithRoles: GetUserRolesAndRolePermissions_C_ReturnType;
    children: React.ReactNode;
    canAccessRoutes: CanAccessRoutes;
}) {
    const [showSideNav, setShowSideNav] = useState<boolean>(true);

    function toggleSideNav() {
        setShowSideNav(!showSideNav);
    }
    return (
        <div className="relative bg-slate-50 dark:bg-gray-900 min-h-screen">
            <SideNav
                showSideNav={showSideNav}
                canAccessRoutes={canAccessRoutes}
            />

            <div
                className={`relative transition-all ${showSideNav ? "ml-[300px]" : ""}`}
            >
                <Navbar
                    onClick={toggleSideNav}
                    user={user}
                    userWithRoles={userWithRoles}
                />
                <main className="p-8 transition-all">{children}</main>
            </div>
        </div>
    );
}
