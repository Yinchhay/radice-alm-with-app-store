import { Roboto } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Radi Center",
    description: "Radi center",
};

const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={roboto.className}>{children}</body>
        </html>
    );
}
