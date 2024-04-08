"use client";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { logout } from "./fetch";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";

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
        <Button disabled={formStatus.pending}>
            {formStatus.pending ? "Logging out" : "Logout"}
        </Button>
    );
}
