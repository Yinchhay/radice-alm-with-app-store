"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Roboto_Condensed,
    Roboto_Flex,
    Roboto,
    Roboto_Mono,
} from "next/font/google";
import GlitchText from "@/components/GlitchText";
import Link from "next/link";
import { colors } from "@/lib/colors";
import { useTesterAuth } from "@/app/contexts/TesterAuthContext";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto_mono = Roboto_Mono({ weight: ["400", "700"], subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export type NavbarVariant = "default" | "justLogo" | "loggedIn" | "dashboard" | "tester";

interface NavbarProps {
  variant?: NavbarVariant;
}

export default function Navbar({ variant = "default" }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { tester, isAuthenticated, logout, isLoading } = useTesterAuth();
    // Logo element
    const logo = (
        <Link href="/" style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <img
                src="/RadiceLogo_light.png"
                alt="Radice Logo"
                className="object-contain h-10 w-36 sm:h-12 sm:w-48 md:h-[50px] md:w-[300px]"
                style={{ objectFit: "contain", display: "block" }}
            />
        </Link>
    );

    // Styles
    const navLinkStyle = {
        color: "#000",
        fontFamily: "Inter",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        textDecoration: "none",
    };
    const signUpStyle = {
        ...navLinkStyle,
        display: "flex",
        padding: "8px 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        borderRadius: "8px",
        background: "#000",
        color: "#fff",
    };

    const appStoreGradientBorder = {
        ...navLinkStyle,
        display: "flex",
        padding: "8px 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        border: "2px solid transparent",
        borderRadius: "8px",
        background: "linear-gradient(white, white) padding-box, linear-gradient(120deg, #ffb56b, #ff5ec4, #7c5fff, #01cfff, #00ff87) border-box",
    };

    // Navigation links (shared)
    const navLinks = (
        <div className="flex items-center gap-8">
            <Link href="/about" style={navLinkStyle}>Who We Are</Link>
            <Link href="/media" style={navLinkStyle}>Media</Link>
            <Link href="/dashboard" style={navLinkStyle}>Developer</Link>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    background: "#fff",
                    color: "#6B7280",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 4,
                    padding: "2px 6px",
                    zIndex: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                    border: "2px solid #D1D5DB"
                }}>New</span>
                <Link href="/appstore" style={appStoreGradientBorder}>App Store</Link>
            </div>
        </div>
    );

    // Profile avatar and logout
    const profileMenu = (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-base font-bold text-gray-700 uppercase">
                {tester ? `${tester.firstName?.[0] || ''}${tester.lastName?.[0] || ''}` : "?"}
            </div>
            <span className="text-sm font-medium text-gray-800">{tester?.firstName} {tester?.lastName}</span>
        </div>
    );

    // Auth buttons (default)
    const authButtons = (
        <div className="flex items-center gap-4" style={{ width: "300px", justifyContent: "flex-end" }}>
            <Link 
                href="/tester-login"
                style={{
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                }}
            >
                Login
            </Link>
            <Link 
                href="/tester-registration"
                style={{
                    display: "flex",
                    padding: "8px 12px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "8px",
                    background: "#000",
                    color: "#fff",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    textDecoration: "none",
                }}
            >
                Sign Up
            </Link>
        </div>
    );

    // LoggedIn right side
    const loggedInRight = (
        <div className="flex items-center gap-4">
            {/* Replace with actual avatar/profile logic as needed */}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eee" }} />
        </div>
    );

    // Dashboard links (example)
    const dashboardLinks = (
        <div className="flex items-center gap-8">
            <Link 
                href="/dashboard"
                style={{
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                }}
            >
                Dashboard
            </Link>
            <Link 
                href="/dashboard/projects"
                style={{
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                }}
            >
                Projects
            </Link>
            <Link 
                href="/dashboard/media"
                style={{
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                }}
            >
                Media
            </Link>
        </div>
    );

    // Tester auth buttons
    const testerAuthButtons = (
        <div className="flex items-center gap-4" style={{ width: "300px", justifyContent: "flex-end" }}>
            <Link 
                href="/login"
                style={{
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                }}
            >
                Login
            </Link>
            <Link 
                href="/join-us"
                style={{
                    display: "flex",
                    padding: "8px 12px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "8px",
                    background: "#000",
                    color: "#fff",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    textDecoration: "none",
                }}
            >
                Sign Up
            </Link>
        </div>
    );

    const navLinksMobile = (
        <div className="flex flex-col items-center space-y-6 w-full">
            <Link href="/about" className="text-xl font-medium w-full text-center">Who We Are</Link>
            <Link href="/media" className="text-xl font-medium w-full text-center">Media</Link>
            <Link href="/dashboard" className="text-xl font-medium w-full text-center">Developer</Link>
            <div className="relative w-full flex flex-col items-center">
                <Link href="/appstore" className="text-xl font-medium w-full text-center border-2 border-transparent rounded-lg px-4 py-2 mt-2 mb-1 bg-gradient-to-r from-white to-white bg-clip-padding" style={{background: "linear-gradient(white, white) padding-box, linear-gradient(120deg, #ffb56b, #ff5ec4, #7c5fff, #01cfff, #00ff87) border-box"}}>
                    App Store
                </Link>
                <span className="absolute -top-4 right-1 bg-white text-gray-500 text-xs font-bold rounded px-2 py-0.5 border border-gray-200 shadow">New</span>
            </div>
        </div>
    );

    const authButtonsMobile = (
        <div className="flex flex-col items-center space-y-4 w-full mt-4">
            <Link href="/tester-login" className="text-lg w-full text-center">Login</Link>
            <Link href="/tester-registration" className="w-full text-center bg-black text-white rounded-lg py-2 text-lg font-semibold">Sign Up</Link>
        </div>
    );

    // Layouts
    if (variant === "justLogo") {
        return (
            <nav className="flex w-full max-w-[1440px] px-4 sm:px-10 py-4 justify-between items-center mx-auto">
                {logo}
            </nav>
        );
    }
    if (variant === "loggedIn") {
        return (
            <nav className="flex w-full max-w-[1440px] px-4 sm:px-10 py-4 justify-between items-center mx-auto">
                {logo}
                <div className="hidden md:flex flex-1 justify-center">{navLinks}</div>
                <div className="hidden md:flex">{isAuthenticated ? profileMenu : loggedInRight}</div>
                {/* Hamburger for mobile */}
                <button className="md:hidden ml-auto" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col" onClick={() => setMobileMenuOpen(false)}>
                        <div className="bg-white w-full max-w-xs h-full flex flex-col items-center justify-center p-4 mx-auto rounded-l-lg" onClick={e => e.stopPropagation()}>
                            <button className="mb-6 mx-auto" onClick={() => setMobileMenuOpen(false)}>
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
                            </button>
                            <div className="flex flex-col items-center space-y-6 w-full">
                                {navLinksMobile}
                                {isAuthenticated ? profileMenu : authButtonsMobile}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
    if (variant === "dashboard") {
        return (
            <nav className="flex w-full max-w-[1440px] px-4 sm:px-10 py-4 justify-between items-center mx-auto">
                {logo}
                <div className="hidden md:flex flex-1 justify-center">{dashboardLinks}</div>
                <div className="hidden md:flex">{isAuthenticated ? profileMenu : loggedInRight}</div>
                <button className="md:hidden ml-auto" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col">
                        <div className="bg-white w-4/5 max-w-xs h-full p-6 flex flex-col">
                            <button className="self-end mb-6" onClick={() => setMobileMenuOpen(false)}>
                                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
                            </button>
                            <div className="flex flex-col items-start space-y-6 w-full">
                                {dashboardLinks}
                                {isAuthenticated ? profileMenu : loggedInRight}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
    if (variant === "tester") {
        return (
            <nav className="flex w-full max-w-[1440px] px-4 sm:px-10 py-4 justify-between items-center mx-auto">
                {logo}
                <div className="hidden md:flex flex-1 justify-center">{navLinks}</div>
                <div className="hidden md:flex">{isAuthenticated ? profileMenu : testerAuthButtons}</div>
                {/* Hamburger for mobile */}
                <button className="md:hidden ml-auto" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col">
                        <div className="bg-white w-4/5 max-w-xs h-full p-6 flex flex-col">
                            <button className="self-end mb-6" onClick={() => setMobileMenuOpen(false)}>
                                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
                            </button>
                            <div className="flex flex-col items-start space-y-6 w-full">
                                {navLinksMobile}
                                {isAuthenticated ? profileMenu : authButtonsMobile}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
    // Default
    return (
        <nav className="flex w-full max-w-[1440px] px-4 sm:px-10 py-4 justify-between items-center mx-auto">
            {logo}
            <div className="hidden md:flex flex-1 justify-center">{navLinks}</div>
            <div className="hidden md:flex">{isAuthenticated ? profileMenu : authButtons}</div>
            <button className="md:hidden ml-auto" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col" onClick={() => setMobileMenuOpen(false)}>
                    <div className="bg-white w-4/5 max-w-xs h-full p-6 flex flex-col">
                        <button className="self-end mb-6" onClick={() => setMobileMenuOpen(false)}>
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#000" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
                        </button>
                        <div className="flex flex-col items-center space-y-8 w-full max-w-xs">
                            {navLinksMobile}
                            {isAuthenticated ? profileMenu : authButtonsMobile}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}