import { Roboto } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/Toaster";
import Head from "next/head";

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
            <Head>
                <meta
                    property="og:image"
                    content="https://radice.paragoniu.app/opengraph-image.png"
                />
                <meta property="og:image:alt" content="Radice" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="570" />
                <meta
                    name="twitter:image"
                    content="https://radice.paragoniu.app/twitter-image.png"
                />
                <meta property="twitter:image:alt" content="Radice" />
                <meta name="twitter:image:type" content="image/png" />
                <meta name="twitter:image:width" content="1200" />
                <meta name="twitter:image:height" content="570" />
                <link rel="icon" href="favicon.ico" />
            </Head>
            <body className={roboto.className}>
                <Toaster>{children}</Toaster>
            </body>
        </html>
    );
}
