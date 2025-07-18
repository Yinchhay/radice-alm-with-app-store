export const dynamic = "force-dynamic";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { Suspense } from "react";
import AppStorePage from "./AppStoreClient";

export const metadata: Metadata = {
    title: "Appstore - Radice",
    description: "Join us at Radice to learn and grow with us.",
};

export default function JoinUsPage() {
    return (
        <div>
            <Navbar />
            <Suspense fallback={<div className="text-center py-10">Loading Appstore…</div>}>
                <AppStorePage />
            </Suspense>
            <Footer />
        </div>
    );
}
