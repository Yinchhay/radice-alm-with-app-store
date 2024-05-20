import { Metadata } from "next";
import LoginForm from "./login_form";
import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// static metadata
export const metadata: Metadata = {
    title: "Login into your account | Radi Center",
    description: "Login into your account to access your dashboard",
};

export default async function Page() {
    const user = await getAuthUser();
    if (user) {
        redirect("/dashboard/projects");
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto min-h-[60vh] grid justify-center mt-16">
                <div>
                    <LoginForm />
                    <Link href="/api/oauth/github/login">
                        <Button className="mt-4">Sign in with GitHub</Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
