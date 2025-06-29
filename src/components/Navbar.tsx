import Image from "next/image";
import {
    Roboto_Condensed,
    Roboto_Flex,
    Roboto,
    Roboto_Mono,
} from "next/font/google";
import GlitchText from "@/components/GlitchText";
import Link from "next/link";
import { colors } from "@/lib/colors";

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
                            alt="Radice"
                        />
                    </Link>
                </div>
                <div
                    className={`mt-6 flex justify-center col-span-3 ${roboto_mono.className}`}
                >
                    <ul className="flex gap-10 items-center">
                        <Link href={"/about"} className="uppercase">
                            Who we are
                        </Link>
                        <Link href={"/media"} className="uppercase">
                            Media
                        </Link>
                        <Link href={"/join-us"} className="uppercase">
                            Join Us
                        </Link>
                        <Link href={"/appstore"} className="uppercase">
                            Appstore
                        </Link>
                    </ul>
                </div>
                <div
                    className={`mt-6 flex justify-end items-center gap-6 ${roboto_mono.className}`}
                >
                    <Link 
                        href="/tester-login" 
                        className="uppercase"
                    >
                        Log In
                    </Link>
                    <Link 
                        href="/login" 
                        className="uppercase"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}
