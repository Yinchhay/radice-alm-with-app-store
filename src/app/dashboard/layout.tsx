import { getAuthUser } from "@/auth/lucia";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logout } from "./_components/logout";
import Image from "next/image";
import NavGroup from "./_components/nav-group";
import NavItem from "./_components/nav-item";
import {
    IconCategory,
    IconChecklist,
    IconClipboardList,
    IconClipboardText,
    IconMoon,
    IconStack2,
    IconStack3,
    IconUser,
    IconUserCheck,
    IconUserCog,
    IconUsers,
} from "@tabler/icons-react";
import ToggleSwitch from "@/components/ToggleSwitch";

export const metadata: Metadata = {
    title: "Dashboard | Radi Center",
    description: "Dashboard",
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

    return (
        <>
            <aside className="fixed top-0 left-0 bg-gray-900 h-screen w-[300px] z-50">
                <div className="pb-16"></div>
                <NavGroup title="Profile">
                    <div className="px-4">
                        <Image
                            className="rounded-full"
                            src={"/profile_placeholder.jpg"}
                            width={120}
                            height={120}
                            alt=""
                        />
                        <h1 className="text-xl text-white font-bold mt-4">
                            Yato Rizz God
                        </h1>
                    </div>
                </NavGroup>
                <NavGroup title="Features">
                    <NavItem link="/dashboard/manage/account">
                        <IconUserCog size={28} />
                        <h2>Manage Account</h2>
                    </NavItem>
                    <NavItem link="/dashboard/manage/projects">
                        <IconStack2 size={28} />
                        <h2>Manage Projects</h2>
                    </NavItem>
                    <NavItem link="/dashboard/manage/all-projects">
                        <IconStack3 size={28} />
                        <h2>Manage All Projects</h2>
                    </NavItem>
                    <NavItem link="/dashboard/manage/application-forms">
                        <IconChecklist size={28} />
                        <h2>Manage Application Forms</h2>
                    </NavItem>
                    <NavItem link="/dashboard/manage/categories">
                        <IconCategory size={28} />
                        <h2>Manage Categories</h2>
                    </NavItem>
                    <NavItem link="/dashboard/manage/partners">
                        <IconUserCheck size={28} />
                        <h2>Manage Partners</h2>
                    </NavItem>
                    <NavItem link="/dashboard/manage/roles">
                        <IconUserCog size={28} />
                        <h2>Manage Roles</h2>
                    </NavItem>
                    <NavItem link="/dashboard/manage/users">
                        <IconUsers size={28} />
                        <h2>Manage Users</h2>
                    </NavItem>
                </NavGroup>
                <NavGroup title="Others">
                    <div className="w-full flex items-center justify-between gap-2 text-gray-200 font-bold px-4 py-2 rounded-sm hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                            <IconMoon size={28} />
                            <h2>Dark Mode</h2>
                        </div>
                        <ToggleSwitch variant="secondary" />
                    </div>
                    <Logout />
                </NavGroup>
            </aside>
            <main className="ml-[300px] min-h-screen bg-slate-50 p-4">
                {children}
            </main>
        </>
    );
}
