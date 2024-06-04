"use client";
import { useState } from "react";
import Navbar from "./navbar";
import SideNav from "./sidenav";
import { User } from "lucia";
import { CanAccessRoutes } from "../layout";

export default function DashboardLayout({
    children,
    user,
    canAccessRoutes,
}: {
    user: User;
    children: React.ReactNode;
    canAccessRoutes: CanAccessRoutes;
}) {
    const [showSideNav, setShowSideNav] = useState<boolean>(true);

    function toggleSideNav() {
        setShowSideNav(!showSideNav);
    }
    return (
        <div className="relative">
            <Navbar onClick={toggleSideNav} user={user} />
            <div className="relative">
                <SideNav showSideNav={showSideNav} canAccessRoutes={canAccessRoutes}/>
                <main
                    className={[
                        "min-h-screen bg-slate-50 p-8 transition-all",
                        showSideNav ? "ml-[300px]" : "",
                    ].join(" ")}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
