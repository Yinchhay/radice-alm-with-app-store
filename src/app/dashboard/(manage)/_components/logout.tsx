"use client";
import Button from "@/components/Button";
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
            className="w-full flex items-center gap-2 text-gray-200 font-bold px-4 py-2 rounded-sm hover:bg-gray-800 hover:text-red-500 transition-all"
        >
            <IconLogout2 size={28} />
            {formStatus.pending ? "Logging out" : "Logout"}
        </button>
    );
}
