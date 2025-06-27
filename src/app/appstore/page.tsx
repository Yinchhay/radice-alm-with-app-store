import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AppStorePage from "./appstore";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Appstore - Radice",
    description: "Join us at Radice to learn and grow with us.",
};

export default function JoinUsPage() {
    return (
        <div>
            <Navbar />
            <AppStorePage />
            <Footer />
        </div>
    );
}
