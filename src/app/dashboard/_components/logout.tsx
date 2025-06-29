"use client";
import { useEffect, useState } from "react";
import { logout } from "../_functions/fetch";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";
import { IconLogout2 } from "@tabler/icons-react";

export function Logout() {
    const [result, setResult] = useState<Awaited<ReturnType<typeof logout>>>();

    useEffect(() => {
        if (result?.success) {
            redirect("/");
        }
    }, [result]);

    return (
        <form action={async (formData: FormData) => setResult(await logout())}>
            <LogoutButton />
        </form>
    );
}

function LogoutButton() {
    const formStatus = useFormStatus();
    return (
        <button
            disabled={formStatus.pending}
            className={[
                "w-full",
                "flex",
                "p-3",
                "px-5",
                "items-center",
                "gap-4",
                "self-stretch",
                "rounded-lg",
                "text-gray-700",
                "cursor-pointer",
                "transition-colors",
                "hover:bg-gray-100",
                "font-semibold",
            ].join(" ")}
        >
            <IconLogout2 size={20} />
            {formStatus.pending ? "Logging out" : "Logout"}
        </button>
    );
}