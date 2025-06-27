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
                    pathName === link
                        ? "bg-gray-100 font-semibold"
                        : "hover:bg-gray-100",
                ].join(" ")}
            >
                {children}
            </Link>
        </li>
    );
}