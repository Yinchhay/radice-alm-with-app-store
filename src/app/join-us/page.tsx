import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import JoinUsForm from "./join_us";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join Us - Radice",
    description: "Join us at Radice to learn and grow with us.",
};

export default function JoinUsPage() {
    return (
        <div>
            <Navbar />
            <JoinUsForm />
            <Footer />
        </div>
    );
}
