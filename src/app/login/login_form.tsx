"use client";
import { useRef, useState } from "react";

export default function LoginForm() {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex w-[600px] p-[40px] flex-col items-center gap-[40px]">
            <h1 className="text-5xl font-bold text-center">Radice Developer</h1>
            <form className="flex flex-col gap-6 w-full">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="firstName" className="block mb-2 text-sm font-medium">First Name</label>
                        <input
                            id="firstName"
                            name="firstName"
                            required
                            placeholder="Steve"
                            className="w-full h-[50px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lastName" className="block mb-2 text-sm font-medium">Last Name</label>
                        <input
                            id="lastName"
                            name="lastName"
                            required
                            placeholder="Jobs"
                            className="w-full h-[50px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                </div>
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
                <div>
                    <label htmlFor="cv" className="block mb-2 text-sm font-medium">CV</label>
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[160px] bg-white transition-colors cursor-pointer ${dragActive ? 'border-black bg-gray-50' : 'border-gray-300'}`}
                        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                        onDrop={e => {
                            e.preventDefault();
                            setDragActive(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                const file = e.dataTransfer.files[0];
                                setCvFile(file);
                                if (fileInputRef.current) {
                                    const dt = new DataTransfer();
                                    dt.items.add(file);
                                    fileInputRef.current.files = dt.files;
                                }
                            }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            id="cv"
                            name="cv"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={e => {
                                const file = e.target.files?.[0] || null;
                                setCvFile(file);
                            }}
                        />
                        <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                            <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="4" y="16" width="16" height="4" rx="2"/>
                        </svg>
                        <div className="text-base">
                            <span className="font-semibold underline">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-sm text-gray-400 mt-1">.pdf only</div>
                        {cvFile && (
                            <div className="mt-4 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                                Selected: <span className="font-medium">{cvFile.name}</span>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-black text-white rounded-xl py-4 text-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                    Apply
                </button>
            </form>
            
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center w-full gap-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                
                <button
                    type="button"
                    className="w-full bg-white text-black border border-gray-300 rounded-xl py-4 text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Login with GitHub
                </button>
                
                <a href="/forgot-password" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Forgot password?
                </a>
            </div>
            
            <div className="text-center">
                <a href="/join-us" className="underline text-base">Already a developer?</a>
            </div>
        </div>
    );
}