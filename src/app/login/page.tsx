import { Metadata } from "next";
import LoginForm from "./login_form";
import { z } from "zod";
import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";

// static metadata
export const metadata: Metadata = {
    title: 'Login into your account | Radi Center',
    description: 'Login into your account to access your dashboard',
};

// TODO: in user story, password must contain at least 1 upper case.
// Write schema in server component then import to server action.
// if write in client nextjs will throw error
// 'safeParse()' doesn't work in server component'
export const loginFormSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email({
            message: "Invalid email address",
        }),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .max(32, {
            message: "Password must be at most 32 characters long",
        }),
});

export default async function Page() {
    const user = await getAuthUser();
    if (user) {
        return redirect('/dashboard/manage/associated-project');
    }

    return (
        <>
            <LoginForm />
        </>
    );
}
