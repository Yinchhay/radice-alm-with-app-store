import { Roboto } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/Toaster";
import { Metadata } from "next";

const roboto = Roboto({
    weight: ["300", "400", "700"],
    subsets: ["latin"],
    display: "swap",
});

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://radice.paragoniu.app",
    name: "Radice",
    description:
        "Radice is a center for applied research and development initiatives of Paragon International University. We are a hub of creativity and discovery, where ideas take flight and possibilities are endless. Radice is passionate about innovation and creativity, and strives to deliver high-quality results.",
    publisher: {
        "@type": "Organization",
        name: "Radice",
        logo: {
            "@type": "ImageObject",
            url: "https://radice.paragoniu.app/logo.png",
            width: 192,
            height: 192,
        },
    },
};

export const metadata: Metadata = {
    metadataBase: new URL("https://radice.paragoniu.app/"),
    title: "Radice",
    icons: [
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
    alternates: {
        canonical: "https://radice.paragoniu.app/",
    },
    verification: {
        google: "oC_553TyQAcZbXu9YbNpOxqhYrHEqNhUoFe_xtdc4ig",
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </body>
        </html>
    );
}
