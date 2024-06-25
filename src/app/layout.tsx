import { Roboto } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/Toaster";

const roboto = Roboto({
    weight: ["300", "400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata = {
    metadataBase: new URL("https://radice.paragoniu.app/"),
    title: "Radice",
    icons: [
        {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            url: "/favicon-32x32.png",
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            url: "/favicon-16x16.png",
        },
        {
            rel: "apple-touch-icon",
            sizes: "180x180",
            url: "/apple-touch-icon.png",
        },
    ],
    description:
        "Radice is a center for applied research and development initiatives of Paragon International University. We are a hub of creativity and discovery, where ideas take flight and possibilities are endless. Radice is passionate about innovation and creativity, and strives to deliver high-quality results.",
    openGraph: {
        images: [
            {
                url: "https://radice.paragoniu.app/opengraph-image.png",
                alt: "Radice",
                type: "image/png",
                width: 1200,
                height: 570,
            },
        ],
    },
    twitter: {
        images: [
            {
                url: "https://radice.paragoniu.app/twitter-image.png",
                alt: "Radice",
                type: "image/png",
                width: 1200,
                height: 570,
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body className={roboto.className}>
                <Toaster>{children}</Toaster>
            </body>
        </html>
    );
}
