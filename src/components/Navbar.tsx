import Image from "next/image";
import {
    Roboto_Condensed,
    Roboto_Flex,
    Roboto,
    Roboto_Mono,
} from "next/font/google";
import GlitchText from "@/components/GlitchText";
import Link from "next/link";
const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto_mono = Roboto_Mono({ weight: ["400", "700"], subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export default function Navbar() {
    return (
        <nav>
            <div className="container m-auto grid grid-cols-5 py-4">
                <div className="">
                    <Link href={"/"} className="uppercase text-5xl font-bold">
                        <Image
                            src={"/RadiceLogo_light.png"}
                            width={200}
                            height={200}
                            alt="Radice Logo"
                        />
                    </Link>
                </div>
                <div
                    className={`mt-6 flex justify-center col-span-3 ${roboto_mono.className}`}
                >
                    <ul className="flex gap-16">
                        <Link href={"/about"} className="uppercase">
                            Who we are
                        </Link>
                        <Link href={"/media"} className="uppercase">
                            Media
                        </Link>
                        <Link href={"/join-us"} className="uppercase">
                            Join Us
                        </Link>
                    </ul>
                </div>
                <div
                    className={`mt-6 flex justify-end ${roboto_mono.className}`}
                >
                    <a href="/login" className="uppercase">
                        Dashboard
                    </a>
                </div>
            </div>
        </nav>
    );
}
