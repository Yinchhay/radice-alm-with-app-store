"use client";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function TesterLoginForm() {
    const [result, setResult] = useState<{
        success: boolean;
        errors?: string[];
    }>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Redirect to your custom Google OAuth endpoint
        window.location.href = "/api/auth/google";
    };

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            if (!email || !password) {
                setResult({
                    success: false,
                    errors: ["Please fill in all fields"],
                });
                setIsLoading(false);
                return;
            }
            // Call real API endpoint
            const response = await fetch("/api/tester/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setResult({ success: true });
                router.push("/appstore");
            } else {
                setResult({
                    success: false,
                    errors: [data.error || "Invalid credentials"],
                });
            }
        } catch (error) {
            setResult({
                success: false,
                errors: ["An error occurred. Please try again."],
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-6" action={handleSubmit}>
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="email"
                    className="text-base text-black font-medium"
                >
                    Email
                </label>
                <InputField
                    name="email"
                    id="email"
                    type="email"
                    required
                    className="h-12 px-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400"
                    placeholder="Enter your email"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="password"
                    className="text-base text-black font-medium"
                >
                    Password
                </label>
                <InputField
                    type="password"
                    name="password"
                    id="password"
                    required
                    className="h-12 px-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400"
                    placeholder="Password"
                />
            </div>
            {result?.errors && (
                <div className="text-red-600 text-sm text-center">
                    {result.errors.map((err, i) => (
                        <div key={i}>{err}</div>
                    ))}
                </div>
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] bg-black text-white rounded-xl text-lg font-semibold"
                style={{ boxShadow: "none" }}
            >
                {isLoading ? "Logging in..." : "Log In"}
            </button>
            {/* Divider */}
            <div className="flex items-center gap-2 w-full">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-base">or</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="flex flex-col gap-3 mt-6 w-full">
                {/* Google Button */}
                <a
                    href="/api/auth/google"
                    className="w-full h-12 border border-gray-400 rounded-lg flex items-center justify-center gap-2 text-base font-normal bg-white hover:bg-gray-50 transition-all"
                    style={{ boxShadow: "none" }}
                >
                    <img src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" width="24" height="24" />
                    Log In with Google
                </a>
                
            </div>
        </form>
    );
}
