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
  const [showSideNav, setShowSideNav] = useState(true);

  const NAVBAR_HEIGHT = 70;
  const SIDEBAR_WIDTH = 300;

  function toggleSideNav() {
    setShowSideNav(!showSideNav);
  }

  return (
    <div className="bg-slate-white dark:bg-gray-900 min-h-screen">
      {/* Fixed Navbar */}
        <header
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
          style={{ height: NAVBAR_HEIGHT }}
        >
          <Navbar
            onClick={toggleSideNav}
            user={user}
            userWithRoles={userWithRoles}
          />
        </header>

      {/* Main content area with top margin to account for fixed navbar */}
        <div
        className="flex justify-center pt-[70px] min-h-screen"
        style={{ paddingTop: NAVBAR_HEIGHT }}
        >
        {/* Container with max-width */}
        <div className="max-w-[1440px] w-full flex">
          {/* Sidebar */}
          {showSideNav && (
            <aside
              className="sticky top-[70px] bg-white dark:bg-gray-900 overflow-y-auto"
              style={{ 
                width: SIDEBAR_WIDTH,
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`
              }}
            >
              <SideNav showSideNav={showSideNav} canAccessRoutes={canAccessRoutes} />
            </aside>
          )}

          {/* Main content */}
          <main 
            className={`flex-1 bg-white dark:bg-gray-800 overflow-auto`}
            style={{ 
              minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
            }}
          >
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
