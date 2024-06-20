import { Roboto } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import Toaster from "@/components/Toaster";
export const metadata: Metadata = {
    title: "Radi Center",
    description: "Radi center",
};

const roboto = Roboto({
    weight: ["300", "400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={roboto.className}>
                <Toaster>{children}</Toaster>
            </body>
        </html>
    );
}
