import { Metadata } from "next";
import TesterLoginForm from "./tester-login-form";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Tester Login - Radice",
    description: "Login to access your Radice tester account",
};

export default function TesterLoginPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar variant="justLogo" />
            <div className="flex items-center justify-center flex-1" style={{ minHeight: "calc(100vh - 72px)" }}>
                <div className="w-full max-w-md flex flex-col items-center px-4">
                    <h1 className="text-4xl font-bold text-black mb-10 text-center">Welcome Back!</h1>
                    <TesterLoginForm />
                    <div className="mt-10 text-center w-full">
                        <a href="/tester-registration" className="text-black underline text-base">Don't have an account?</a>
                    </div>
                </div>
            </div>
        </div>
    );
} 