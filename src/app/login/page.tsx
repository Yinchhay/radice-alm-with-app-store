import { Metadata } from "next";
import LoginForm from "./login_form";
import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

// static metadata
export const metadata: Metadata = {
    title: "Login into your account | Radi Center",
    description: "Login into your account to access your dashboard",
};

export default async function Page() {
    const user = await getAuthUser();
    if (user) {
        redirect("/dashboard/manage/associated-project");
    }

    return (
        <>
            <LoginForm />
            <Link href="/login/github">
                <Button className="mt-4">Sign in with GitHub</Button>
            </Link>
        </>
    );
}