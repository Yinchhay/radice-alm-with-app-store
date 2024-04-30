"use client";

import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { User } from "lucia";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({
    onClick,
    user,
}: {
    onClick: () => void;
    user: User;
}) {
    return (
        <nav className="px-4 py-2 bg-gray-950 flex justify-between">
            <div className="flex items-center gap-2">
                <button onClick={onClick} className="p-2 hover:bg-gray-800">
                    <IconMenu2 size={28} className="text-gray-200" />
                </button>
                <h1 className="text-white text-lg font-bold">Radice</h1>
            </div>
            <Link
                href={"/dashboard/account"}
                className="flex items-center gap-4"
            >
                <h1 className="text-white font-bold">
                    {`${user.firstName} ${user.lastName}`}
                </h1>
                <Image
                    className="rounded-full"
                    src={"/profile_placeholder.jpg"}
                    width={52}
                    height={52}
                    alt="Profile Picture"
                />
            </Link>
        </nav>
    );
}
