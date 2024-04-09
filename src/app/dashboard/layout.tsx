import { getAuthUser } from "@/auth/lucia";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logout } from "./logout";

export const metadata: Metadata = {
    title: "Dashboard | Radi Center",
    description: "Dashboard",
};

export default async function DashboardLayout({
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
            <div className="flex flex-col bg-blue-500">
                <h1>Dashboard Layout Link</h1>
                <Link
                    data-test="manageAccount"
                    href="/dashboard/manage/account"
                >
                    Manage Account
                </Link>
                <Link
                    data-test="manageProjects"
                    href="/dashboard/manage/projects"
                >
                    Manage Projects
                </Link>
                <Link
                    data-test="manageApplicationForm"
                    href="/dashboard/manage/application-forms"
                >
                    Manage Application Forms
                </Link>
                <Link
                    data-test="manageAllProjects"
                    href="/dashboard/manage/all-projects"
                >
                    Manage All Projects
                </Link>
                <Link
                    data-test="manageCategories"
                    href="/dashboard/manage/categories"
                >
                    Manage Categories
                </Link>
                <Link
                    data-test="managePartners"
                    href="/dashboard/manage/partners"
                >
                    Manage Partners
                </Link>
                <Link data-test="manageRoles" href="/dashboard/manage/roles">
                    Manage Roles
                </Link>
                <Link data-test="manageUsers" href="/dashboard/manage/users">
                    Manage Users
                </Link>
                <Logout />
            </div>
            {children}
        </>
    );
}
