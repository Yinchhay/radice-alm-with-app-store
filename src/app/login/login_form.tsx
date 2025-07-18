"use client";
import { useRef, useState } from "react";
import LoginGithubButton from "./login_github";
import { fetchLoginCredential } from "./fetch";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_KEY } from "@/lib/utils";

export default function LoginForm() {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const captchaRef = useRef<ReCAPTCHA>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const captchaToken = captchaRef.current?.getValue() || "";
        if (!captchaToken) {
            setError("Please complete the captcha.");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, captchaToken }),
            });
            const result = await response.json();
            captchaRef.current?.reset();
            if (result.success) {
                window.location.href = "/dashboard/projects";
            } else {
                setError(result.message || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-lg px-4 sm:px-8 py-8 flex flex-col items-center gap-8 mx-auto">
            <h1 className="text-5xl font-bold text-center">Radice Developer</h1>
            <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="w-full h-[50px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        placeholder="Password"
                        className="w-full h-[50px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
                <ReCAPTCHA sitekey={RECAPTCHA_KEY} ref={captchaRef} />
                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                <button
                    type="submit"
                    className="w-full h-[50px] bg-black text-white rounded-xl text-lg font-semibold hover:bg-gray-900 transition-colors"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center w-full gap-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <LoginGithubButton />
                <a href="/forgot-password" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Forgot password?
                </a>
                <a
                    href="/join-us"
                    className="flex px-[12px] py-[8px] justify-center items-center gap-[12px] self-stretch text-gray-600 hover:text-black transition-colors"
                >
                    Want to be a developer?
                </a>
            </div>
        </div>
    );
}