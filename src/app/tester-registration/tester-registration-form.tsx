"use client";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TesterRegistrationForm() {
    const [result, setResult] = useState<{ success: boolean; errors?: string[] }>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const firstName = formData.get("firstName") as string;
            const lastName = formData.get("lastName") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirmPassword") as string;
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                setResult({ success: false, errors: ["Please fill in all fields"] });
                setIsLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setResult({ success: false, errors: ["Passwords do not match"] });
                setIsLoading(false);
                return;
            }
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setResult({ success: true });
            router.push("/tester-dashboard");
        } catch (error) {
            setResult({ success: false, errors: ["An error occurred. Please try again."] });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-6" action={handleSubmit}>
            <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="firstName" className="text-base text-black font-medium">First Name</label>
                    <InputField
                        name="firstName"
                        id="firstName"
                        type="text"
                        required
                        className="h-12 px-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400"
                        placeholder="Enter your first name"
                    />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="lastName" className="text-base text-black font-medium">Last Name</label>
                    <InputField
                        name="lastName"
                        id="lastName"
                        type="text"
                        required
                        className="h-12 px-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400"
                        placeholder="Enter your last name"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-base text-black font-medium">Email</label>
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
                <label htmlFor="password" className="text-base text-black font-medium">Password</label>
                <InputField
                    type="password"
                    name="password"
                    id="password"
                    required
                    className="h-12 px-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400"
                    placeholder="Password"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-base text-black font-medium">Confirm Password</label>
                <InputField
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    className="h-12 px-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400"
                    placeholder="Confirm password"
                />
            </div>
            {result?.errors && (
                <div className="text-red-600 text-sm text-center">
                    {result.errors.map((err, i) => <div key={i}>{err}</div>)}
                </div>
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] bg-black text-white rounded-xl text-lg font-semibold"
                style={{ boxShadow: "none" }}
            >
                Sign Up
            </button>
            {/* Divider */}
            <div className="flex items-center gap-2 w-full">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-base">or</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            {/* GitHub Button */}
            <a
                href="/api/tester-oauth/github/login"
                className="w-full h-12 border border-gray-400 rounded-lg flex items-center justify-center gap-2 text-base font-normal bg-white hover:bg-gray-50 transition-all"
                style={{ boxShadow: "none" }}
            >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.763-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.125-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.236 1.911 1.236 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.824 1.102.824 2.222v3.293c0 .319.192.694.801.576C20.565 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Sign Up with GitHub
            </a>
        </form>
    );
} 