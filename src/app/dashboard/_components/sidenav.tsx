"use client";
import {
    IconCategory,
    IconChecklist,
    IconStack2,
    IconStack3,
    IconUserCheck,
    IconUserCog,
    IconUsers,
    IconFile // Assuming IconFile is used for Media
} from "@tabler/icons-react";
import NavItem from "./nav-item";
import { Logout } from "./logout";
import { CanAccessRoutes } from "../layout";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SideNav({
    showSideNav,
    canAccessRoutes,
}: {
    showSideNav: boolean;
    canAccessRoutes: CanAccessRoutes;
}) {
    const { theme, setTheme } = useTheme();
    const [darkMode, setDarkMode] = useState(theme === "dark");

    useEffect(() => {
        console.log("Current theme:", theme);
    }, [theme]);

    return (
        <aside
            className={[
                "bg-white",
                "transition-all",
                showSideNav ? "block" : "hidden",
                "fixed",
                "w-[300px]",
                "h-[917px]",
                "p-[32px_24px]",
                "flex",
                "flex-col",
                "gap-4",
            ].join(" ")}
        >
            <h1 className="text-gray-700 text-sm font-bold">Dashboard</h1>
            <div className="flex flex-col gap-4 list-none">
                <div className="flex flex-col font-semibold gap-1">
                    <NavItem link="/dashboard/account">
                        <IconUserCog size={20} />
                        <h2>Account</h2>
                    </NavItem>
                    <NavItem link="/dashboard/projects">
                        <IconStack2 size={20} />
                        <h2>Projects</h2>
                    </NavItem>
                    {canAccessRoutes.manageAllProjects && (
                        <NavItem link="/dashboard/all-projects">
                            <IconStack3 size={20} />
                            <h2>All Projects</h2>
                        </NavItem>
                    )}
                    {canAccessRoutes.manageApplicationForms && (
                        <NavItem link="/dashboard/application-forms">
                            <IconChecklist size={20} />
                            <h2>Application Forms</h2>
                        </NavItem>
                    )}
                    {canAccessRoutes.manageCategories && (
                        <NavItem link="/dashboard/categories">
                            <IconCategory size={20} />
                            <h2>Categories</h2>
                        </NavItem>
                    )}
                    {canAccessRoutes.managePartners && (
                        <NavItem link="/dashboard/partners">
                            <IconUserCheck size={20} />
                            <h2>Partners</h2>
                        </NavItem>
                    )}
                    {canAccessRoutes.manageRoles && (
                        <NavItem link="/dashboard/roles">
                            <IconUsers size={20} />
                            <h2>Roles</h2>
                        </NavItem>
                    )}
                    {canAccessRoutes.manageUsers && (
                        <NavItem link="/dashboard/users">
                            <IconUsers size={20} />
                            <h2>Users</h2>
                        </NavItem>
                    )}
                    {canAccessRoutes.manageMedia && (
                        <NavItem link="/dashboard/media">
                            <IconFile size={20} />
                            <h2>Media</h2>
                        </NavItem>
                    )}
                </div>
                <div className="mt-4">
                    <h1 className="text-gray-700 text-sm font-bold">Others</h1>
                    <Logout />
                </div>
            </div>
        </aside>
    );
}