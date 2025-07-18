"use client";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Enhanced friendlyError with HTML formatting
const friendlyError = (msg: string) => {
  if (msg.includes("at least 8 characters")) {
    return <>Your password must be at least <b>8 characters</b> long.</>;
  }
  if (msg.includes("Password must contain at least one lowercase letter, one uppercase letter, and one number")) {
    return (
      <div className="text-left max-w-md mx-auto mb-2">
        <div className="font-semibold mb-1">Password requirements</div>
        <ul className="list-disc ml-6 text-sm">
          <li>One lowercase letter</li>
          <li>One uppercase letter</li>
          <li>One number</li>
        </ul>
      </div>
    );
  }
  if (msg.includes("already exists")) {
    return <>An account with this email already exists. <a href='/tester-login' className='underline'>Log in?</a></>;
  }
  // For any other error, show nothing
  return null;
};

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
            // Call real API endpoint
            const response = await fetch("/api/tester/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setResult({ success: true });
                router.push("/appstore");
            } else {
                // Show Zod details if present (array or string)
                if (data.details) {
                    if (Array.isArray(data.details)) {
                        setResult({
                            success: false,
                            errors: data.details.map((err: any) => err.message || String(err))
                        });
                    } else {
                        setResult({
                            success: false,
                            errors: data.details.split('\n')
                        });
                    }
                } else {
                    setResult({ success: false, errors: [data.error || "Registration failed"] });
                }
            }
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
                <div className="text-red-600 text-sm text-left w-full">
                    {result.errors.map((err: any, i: number) => {
                        let msg = '';
                        if (typeof err === 'object') {
                            if (err.message) {
                                msg = err.message;
                            } else if (Array.isArray(err.errors) && err.errors[0]?.message) {
                                msg = err.errors[0].message;
                            } else {
                                msg = JSON.stringify(err);
                            }
                        } else {
                            msg = String(err);
                        }
                        const rendered = friendlyError(msg);
                        if (!rendered) return null;
                        return (
                            <div key={i} className="flex items-start gap-2 mb-1">
                                <span>{rendered}</span>
                            </div>
                        );
                    })}
                </div>
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] bg-black text-white rounded-xl text-lg font-semibold"
                style={{ boxShadow: "none" }}
            >
                {isLoading ? "Signing up..." : "Sign Up"}
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
                    Sign Up with Google
                </a>
            </div>
        </form>
    );
} 