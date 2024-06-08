import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import JoinUsForm from "./join_us";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join Us | Radi Center",
    description: "Join us at Radi Center to learn and grow with us.",
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
