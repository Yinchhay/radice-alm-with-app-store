import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import AppAllReviewsPage from "./app-all-reviews-page";

export const metadata: Metadata = {
    title: 'App Details - Radice',
    description: 'View detailed information about this app.',
};

export default function AppInfoPage({ params }: { params: { app_id: string } }) {
    return (
        <div>
            <Navbar />
            <AppAllReviewsPage params={params} />
            <Footer />
        </div>
    );
}