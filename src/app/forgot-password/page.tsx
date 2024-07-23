import { Metadata } from "next";
import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForgotPasswordForm from "./forgot_password_form";

export const metadata: Metadata = {
    title: "Forgot password - Radice",
    description:
        "Forgot your password? No worries, we got you covered! Just enter your email and we will send you a link to reset your password",
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
                <div className="flex gap-4 flex-col">
                    <ForgotPasswordForm />
                </div>
            </div>
            <Footer />
        </div>
    );
}
