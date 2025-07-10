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
                        <NavItem link="/dashboard/app-store-request">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M8.99137 12.1635V8.48096" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8.9916 5.83695H8.99993" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M12.612 1.29187H5.38783C2.87033 1.29187 1.29199 3.07437 1.29199 5.59687V12.4035C1.29199 14.926 2.86283 16.7085 5.38783 16.7085H12.6112C15.137 16.7085 16.7087 14.926 16.7087 12.4035V5.59687C16.7087 3.07437 15.137 1.29187 12.612 1.29187Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h2>App Store Request</h2>
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