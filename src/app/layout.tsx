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
    description:
        "Radice is a Center for applied research and development initiatives of Paragon International University. We are a hub of creativity and discovery, where ideas take flight and possibilities are endless. Radice is passionate about innovation and creativity, and strives to deliver high-quality results.",
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
        <html lang="en" className="scroll-smooth">
            <body className={roboto.className}>
                <Toaster>{children}</Toaster>
            </body>
        </html>
    );
}
