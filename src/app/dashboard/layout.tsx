import { getAuthUser } from "@/auth/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";

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
                <Link href="/dashboard/manage/account"> Manage Account</Link>
                <Link href="/dashboard/manage/associated-project">
                    {" "}
                    Manage Associated Project
                </Link>
                <Link href="/dashboard/manage/application-forms">
                    {" "}
                    Manage Application Forms
                </Link>
                <Link href="/dashboard/manage/all-projects">
                    {" "}
                    Manage All Projects
                </Link>
                <Link href="/dashboard/manage/categories">
                    {" "}
                    Manage Categories
                </Link>
                <Link href="/dashboard/manage/partners"> Manage Partners</Link>
                <Link href="/dashboard/manage/roles"> Manage Roles</Link>
                <Link href="/dashboard/manage/users"> Manage Users</Link>
            </div>
            {children}
        </>
    );
}
