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
        <li>
            <Link
                href={link}
                className={[
                    "flex items-center gap-2 text-gray-200 font-bold px-4 py-2 rounded-sm hover:bg-gray-800",
                    pathName == link ? "bg-gray-800" : "",
                ].join(" ")}
            >
                {children}
            </Link>
        </li>
    );
}
