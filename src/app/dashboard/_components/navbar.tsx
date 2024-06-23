"use client";
import { IconMenu2 } from "@tabler/icons-react";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";

export default function Navbar({
    onClick,
    user,
}: {
    onClick: () => void;
    user: User;
}) {
    return (
        <nav className="sticky h-[100px] z-40 top-0 left-0 px-4 py-2 bg-gray-950 flex justify-between">
            <div className="flex items-center gap-2">
                <button onClick={onClick} className="p-2 hover:bg-gray-800">
                    <IconMenu2 size={28} className="text-gray-200" />
                </button>
            </div>
            <Link
                href={"/dashboard/account"}
                className="flex items-center gap-4"
            >
                <h1 className="text-white font-bold">
                    {`${user.firstName} ${user.lastName}`}
                </h1>
                <ImageWithFallback
                    className="aspect-square object-cover rounded-full"
                    src={fileToUrl(user.profileUrl)}
                    alt={"profile"}
                    width={52}
                    height={52}
                />
            </Link>
        </nav>
    );
}
