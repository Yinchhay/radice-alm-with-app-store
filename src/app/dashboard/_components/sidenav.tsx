"use client";
import {
    IconCategory,
    IconChecklist,
    IconMoon,
    IconStack2,
    IconStack3,
    IconUserCheck,
    IconUserCog,
    IconUsers,
} from "@tabler/icons-react";
import NavGroup from "./nav-group";
import NavItem from "./nav-item";
import ToggleSwitch from "@/components/ToggleSwitch";
import { Logout } from "./logout";
import { Permissions } from "@/types/IAM";
import { userCanAccessRoute } from "@/lib/IAM";
import { CanAccessRoutes } from "../layout";
import Image from "next/image";
import Link from "next/link";
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
    const [darkMode, setDarkMode] = useState(theme == "dark" ? true : false);
    useEffect(() => {
        console.log(darkMode);
    }, []);
    useEffect(() => {
        console.log(theme);
    }, [theme]);
    return (
        <aside
            className={[
                "fixed top-70 left-0 bg-gray-900 dark:bg-gray-950/50 h-screen z-40 transition-all w-[300px]",
                showSideNav ? "translate-x-0" : "translate-x-[-100%]",
            ].join(" ")}
        >
            <div className="p-6">
                <Link href={"/"} className="text-white text-lg font-bold">
                    <Image
                        src={"/RadiceLogo_dark.png"}
                        width={200}
                        height={200}
                        alt="Radice Logo"
                    />
                </Link>
            </div>
            <h1 className="text-gray-200 text-lg font-bold ml-6 mt-4">
                Dashboard
            </h1>
            <NavGroup title="Features">
                <NavItem link="/dashboard/account">
                    <IconUserCog size={28} />
                    <h2>Manage Account</h2>
                </NavItem>
                <NavItem link="/dashboard/projects">
                    <IconStack2 size={28} />
                    <h2>Manage Projects</h2>
                </NavItem>
                {canAccessRoutes.manageAllProjects && (
                    <NavItem link="/dashboard/all-projects">
                        <IconStack3 size={28} />
                        <h2>Manage All Projects</h2>
                    </NavItem>
                )}
                {canAccessRoutes.manageApplicationForms && (
                    <NavItem link="/dashboard/application-forms">
                        <IconChecklist size={28} />
                        <h2>Manage Application Forms</h2>
                    </NavItem>
                )}
                {canAccessRoutes.manageCategories && (
                    <NavItem link="/dashboard/categories">
                        <IconCategory size={28} />
                        <h2>Manage Categories</h2>
                    </NavItem>
                )}
                {canAccessRoutes.managePartners && (
                    <NavItem link="/dashboard/partners">
                        <IconUserCheck size={28} />
                        <h2>Manage Partners</h2>
                    </NavItem>
                )}
                {canAccessRoutes.manageRoles && (
                    <NavItem link="/dashboard/roles">
                        <IconUserCog size={28} />
                        <h2>Manage Roles</h2>
                    </NavItem>
                )}
                {canAccessRoutes.manageUsers && (
                    <NavItem link="/dashboard/users">
                        <IconUsers size={28} />
                        <h2>Manage Users</h2>
                    </NavItem>
                )}
                {canAccessRoutes.manageMedia && (
                    <NavItem link="/dashboard/media">
                        <IconUsers size={28} />
                        <h2>Manage Media</h2>
                    </NavItem>
                )}
            </NavGroup>
            <NavGroup title="Others">
                <div className="w-full flex items-center justify-between gap-2 text-gray-200 font-bold px-4 py-2 rounded-sm hover:bg-gray-800">
                    <div className="flex items-center gap-2">
                        <IconMoon size={28} />
                        <h2>Dark Mode</h2>
                    </div>
                    <ToggleSwitch
                        variant="secondary"
                        onChange={(state) => {
                            if (state) {
                                setDarkMode(true);
                                setTheme("dark");
                            } else {
                                setDarkMode(false);
                                setTheme("light");
                            }
                        }}
                        defaultState={darkMode}
                    />
                </div>
                <Logout />
            </NavGroup>
        </aside>
    );
}
