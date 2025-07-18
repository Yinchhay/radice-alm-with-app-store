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

export type NavbarVariant =
    | "default"
    | "justLogo"
    | "loggedIn"
    | "dashboard"
    | "tester"
    | "appstore";

interface NavbarProps {
    variant?: NavbarVariant;
}

export default function Navbar({ variant = "default" }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { tester, isAuthenticated, logout, isLoading } = useTesterAuth();
    const logo = (
        <Link
            href="/"
            style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
            }}
        >
            <img
                src="/RadiceLogo_light.png"
                alt="Radice Logo"
                className="object-contain h-10 w-20 sm:h-12 sm:w-48 md:h-[50px] md:w-[200px]"
                style={{ objectFit: "contain", display: "block" }}
            />
        </Link>
    );
    
    const handleLogout = async () => {
        await logout();
    };

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
        background:
            "linear-gradient(white, white) padding-box, linear-gradient(120deg, #ffb56b, #ff5ec4, #7c5fff, #01cfff, #00ff87) border-box",
    };

    // Navigation links (shared)
    const navLinks = (
        <div className="flex items-center gap-8">
            <Link href="/about" style={navLinkStyle}>
                Who We Are
            </Link>
            <Link href="/media" style={navLinkStyle}>
                Media
            </Link>
            {/* <Link href="/dashboard" style={navLinkStyle}>
                Developer
            </Link> */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
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
                        border: "2px solid #D1D5DB",
                    }}
                >
                    New
                </span>
                <Link href="/appstore" style={appStoreGradientBorder}>
                    App Store
                </Link>
            </div>
        </div>
    );

    // Profile avatar and logout
    const profileMenu = (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-base font-bold text-gray-700 uppercase">
                {tester
                    ? `${tester.firstName?.[0] || ""}${tester.lastName?.[0] || ""}`
                    : "?"}
            </div>
            <span className="text-sm font-medium text-gray-800">
                {tester?.firstName} {tester?.lastName}
            </span>
            <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition"
                title="Sign out"
                type="button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                </svg>
            </button>
        </div>
    );

    // Mobile profile menu
    const profileMenuMobile = (
        <div className="flex flex-row items-center justify-center gap-3 w-full rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-base font-bold text-gray-700 uppercase">
                {tester
                    ? `${tester.firstName?.[0] || ""}${tester.lastName?.[0] || ""}`
                    : "?"}
            </div>
            <span className="text-base font-medium text-gray-800 text-center">
                {tester?.firstName} {tester?.lastName}
            </span>
        </div>
    );

    const signOutMobile = (
        <div className="flex items-center gap-4 w-full">
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition py-3 px-4 text-black font-medium"
                type="button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                </svg>
                Sign Out
            </button>
        </div>
    );

    // Auth buttons (default)
    const authButtons = (
        <div
            className="flex items-center gap-4"
            style={{ width: "300px", justifyContent: "flex-end" }}
        >
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
            <div
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#eee",
                }}
            />
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
        <div
            className="flex items-center gap-4"
            style={{ width: "300px", justifyContent: "flex-end" }}
        >
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
        <div className="flex flex-col items-center space-y-4 w-full">
            <Link
                href="/about"
                className="text-base font-medium w-full text-center"
            >
                Who We Are
            </Link>
            <Link
                href="/media"
                className="text-base font-medium w-full text-center"
            >
                Media
            </Link>
            <Link
                href="/dashboard"
                className="text-base font-medium w-full text-center"
            >
                Developer
            </Link>
            <div className="relative w-full flex flex-col items-center">
                <Link
                    href="/appstore"
                    className="text-base font-medium w-full text-center border-2 border-transparent rounded-lg px-4 py-2 mt-2 mb-1 bg-gradient-to-r from-white to-white bg-clip-padding"
                    style={{
                        background:
                            "linear-gradient(white, white) padding-box, linear-gradient(120deg, #ffb56b, #ff5ec4, #7c5fff, #01cfff, #00ff87) border-box",
                    }}
                >
                    App Store
                </Link>
                <span className="absolute -top-4 right-1 bg-white text-gray-500 text-xs font-bold rounded px-2 py-0.5 border border-gray-200 shadow">
                    New
                </span>
            </div>
        </div>
    );

    const authButtonsMobile = (
        <div className="flex flex-col items-center space-y-3 w-full mt-4">
            <Link href="/tester-login" className="text-base w-full text-center">
                Login
            </Link>
            <Link
                href="/tester-registration"
                className="w-full text-center bg-black text-white rounded-lg py-2 text-base font-semibold"
            >
                Sign Up
            </Link>
        </div>
    );

    const rightSideWidth = 220; 

    const rightSide = (
        <div style={{ width: rightSideWidth, display: "flex", justifyContent: "flex-end" }}>
            {isAuthenticated ? profileMenu : authButtons}
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
                <div className="hidden md:flex flex-1 justify-center">
                    {navLinks}
                </div>
                <div className="hidden md:flex">
                    {isAuthenticated ? profileMenu : loggedInRight}
                </div>
                {/* Hamburger for mobile */}
                <button
                    className="md:hidden ml-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="#000"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div
                            className="bg-white w-full max-w-sm mx-4 rounded-lg p-6 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="self-end mb-6"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg
                                    width="32"
                                    height="32"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="#000"
                                        strokeWidth="2"
                                        d="M6 6l12 12M6 18L18 6"
                                    />
                                </svg>
                            </button>
                            <div className="flex flex-col items-center space-y-6 w-full">
                                {navLinksMobile}
                                {isAuthenticated
                                    ? profileMenuMobile
                                    : authButtonsMobile}
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
                <div className="hidden md:flex flex-1 justify-center">
                    {dashboardLinks}
                </div>
                <div className="hidden md:flex">
                    {isAuthenticated ? profileMenu : loggedInRight}
                </div>
                <button
                    className="md:hidden ml-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="#000"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div 
                            className="bg-white w-full max-w-sm mx-4 rounded-lg p-6 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="self-end mb-6"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg
                                    width="28"
                                    height="28"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="#000"
                                        strokeWidth="2"
                                        d="M6 6l12 12M6 18L18 6"
                                    />
                                </svg>
                            </button>
                            <div className="flex flex-col items-center space-y-4 w-full">
                                <Link
                                    href="/dashboard"
                                    className="text-base font-medium w-full text-center"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/projects"
                                    className="text-base font-medium w-full text-center"
                                >
                                    Projects
                                </Link>
                                <Link
                                    href="/dashboard/media"
                                    className="text-base font-medium w-full text-center"
                                >
                                    Media
                                </Link>
                                {isAuthenticated ? (
                                    <div className="flex flex-col items-center space-y-4 w-full">
                                        {profileMenuMobile}
                                        {signOutMobile}
                                    </div>
                                ) : authButtonsMobile}
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
                <div className="hidden md:flex flex-1 justify-center">
                    {navLinks}
                </div>
                <div className="hidden md:flex">
                    {isAuthenticated ? profileMenu : testerAuthButtons}
                </div>
                {/* Hamburger for mobile */}
                <button
                    className="md:hidden ml-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="#000"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div 
                            className="bg-white w-full max-w-sm mx-4 rounded-lg p-6 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="self-end mb-6"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg
                                    width="28"
                                    height="28"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="#000"
                                        strokeWidth="2"
                                        d="M6 6l12 12M6 18L18 6"
                                    />
                                </svg>
                            </button>
                            <div className="flex flex-col items-center space-y-4 w-full">
                                {navLinksMobile}
                                {isAuthenticated
                                    ? (
                                        <div className="flex flex-col items-center space-y-3 w-full">
                                            {profileMenuMobile}
                                            {signOutMobile}
                                        </div>
                                    )
                                    : (
                                        <div className="flex flex-col items-center space-y-3 w-full mt-4">
                                            <Link href="/login" className="text-base w-full text-center">
                                                Login
                                            </Link>
                                            <Link
                                                href="/join-us"
                                                className="w-full text-center bg-black text-white rounded-lg py-2 text-base font-semibold"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
    if (variant === "appstore") {
        return (
            <nav className="relative flex w-full max-w-[1440px] px-4 sm:px-10 py-4 items-center mx-auto">
                {/* Left: Logo, fixed width */}
                <div style={{ width: 200, minWidth: 120 }} className="flex items-center justify-start">
                    {logo}
                </div>
                {/* Center: navLinks, always centered absolutely */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-1 justify-center">
                    {navLinks}
                </div>
                {/* Right: Auth buttons, right aligned */}
                <div className="hidden md:flex items-center justify-end ml-auto">
                    {authButtons}
                </div>
                <button
                    className="md:hidden ml-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="#000"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div
                            className="bg-white w-full mx-8 rounded-lg p-6 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="self-end mb-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg
                                    width="28"
                                    height="28"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="#000"
                                        strokeWidth="2"
                                        d="M6 6l12 12M6 18L18 6"
                                    />
                                </svg>
                            </button>
                            <div className="flex flex-col items-center space-y-4 w-full">
                                {navLinksMobile}
                                {authButtonsMobile}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
    // Default
    if (variant === "default") {
        return (
            <nav className="relative flex w-full max-w-[1440px] px-4 sm:px-10 py-4 items-center mx-auto">
                {/* Left: Logo, fixed width */}
                <div style={{ width: 200, minWidth: 120 }} className="flex items-center justify-start">
                    {logo}
                </div>
                {/* Center: navLinks, always centered absolutely */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-1 justify-center">
                    {navLinks}
                </div>
                {/* Right: Developer link, right aligned */}
                <div className="hidden md:flex items-center justify-end ml-auto">
                    <Link href="/dashboard" style={navLinkStyle}>
                        Developer
                    </Link>
                </div>
                <button
                    className="md:hidden ml-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="#000"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div
                            className="bg-white w-full mx-8 rounded-lg p-6 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="self-end mb-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg
                                    width="28"
                                    height="28"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="#000"
                                        strokeWidth="2"
                                        d="M6 6l12 12M6 18L18 6"
                                    />
                                </svg>
                            </button>
                            <div className="flex flex-col items-center space-y-4 w-full">
                                {navLinksMobile}
                                <Link href="/dashboard" className="text-base w-full text-center">
                                    Developer
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
}
