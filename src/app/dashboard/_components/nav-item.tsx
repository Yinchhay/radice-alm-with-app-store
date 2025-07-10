"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({
    link,
    children,
}: {
    link: string;
    children: React.ReactNode;
}) {
    const pathName = usePathname();

    const isActive =
        pathName === link ||
        (link === "/dashboard/projects" && pathName.startsWith("/dashboard/appstore/")) ||
        (link === "/dashboard/app-store-request" && pathName.startsWith("/dashboard/app-store-request"));

    return (
        <li className="w-full list-none">
            <Link
                href={link}
                className={[
                    "flex",
                    "p-3",
                    "px-5",
                    "items-center",
                    "gap-4",
                    "self-stretch",
                    "rounded-lg",
                    "text-gray-700",
                    "w-full",
                    "cursor-pointer",
                    "transition-colors",
                    isActive
                        ? "bg-gray-100 font-semibold"
                        : "hover:bg-gray-100",
                ].join(" ")}
            >
                {children}
            </Link>
        </li>
    );
}