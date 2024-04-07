import { Metadata } from "next";
import LoginForm from "./login_form";
import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";

// static metadata
export const metadata: Metadata = {
    title: 'Login into your account | Radi Center',
    description: 'Login into your account to access your dashboard',
};

export default async function Page() {
    const user = await getAuthUser();
    if (user) {
        redirect('/dashboard/manage/associated-project');
    }

    return (
        <>
            <LoginForm />
            <a href="/login/github">Sign in with GitHub</a>
        </>
    );
}
