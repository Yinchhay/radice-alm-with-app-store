import { getAuthUser } from "@/auth/lucia";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SideNav from "./_components/sidenav";
import DashboardLayout from "./_components/dashboard-layout";

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

    return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
