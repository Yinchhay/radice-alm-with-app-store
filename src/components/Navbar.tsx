import React from "react";
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
    // Logo element
    const logo = (
        <Link href="/" style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <img
                src="/RadiceLogo_light.png"
                alt="Radice Logo"
                style={{ objectFit: "contain", height: "50px", width: "300px", display: "block" }}
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
            <button style={{
                color: "#000",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "normal",
            }}>Logout</button>
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

    // Layouts
    if (variant === "justLogo") {
        return (
            <nav style={{
                display: "flex",
                width: "1440px",
                maxWidth: "1440px",
                padding: "16px 40px 16px 40px",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "auto",
            }}>
                {logo}
            </nav>
        );
    }
    if (variant === "loggedIn") {
        return (
            <nav style={{
                display: "flex",
                width: "1440px",
                maxWidth: "1440px",
                padding: "16px 40px 16px 40px",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "auto",
            }}>
                {logo}
                {navLinks}
                {loggedInRight}
            </nav>
        );
    }
    if (variant === "dashboard") {
        return (
            <nav style={{
                display: "flex",
                width: "1440px",
                maxWidth: "1440px",
                padding: "16px 40px 16px 40px",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "auto",
            }}>
                {logo}
                {dashboardLinks}
                {loggedInRight}
            </nav>
        );
    }
    if (variant === "tester") {
        return (
            <nav style={{
                display: "flex",
                width: "1440px",
                maxWidth: "1440px",
                padding: "16px 40px 16px 40px",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "auto",
            }}>
                {logo}
                {navLinks}
                {testerAuthButtons}
            </nav>
        );
    }
    // Default
    return (
        <nav style={{
            display: "flex",
            width: "1440px",
            maxWidth: "1440px",
            padding: "16px 40px 16px 40px",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "auto",
        }}>
            {logo}
            {navLinks}
            {authButtons}
        </nav>
    );
}
