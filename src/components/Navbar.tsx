import Image from "next/image";
import {
    Roboto_Condensed,
    Roboto_Flex,
    Roboto,
    Roboto_Mono,
} from "next/font/google";
import GlitchText from "@/components/GlitchText";
const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto_mono = Roboto_Mono({ weight: ["400", "700"], subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export default function Home() {
    return (
        <nav>
            <div className="container m-auto flex justify-between py-4 items-center">
                <div className={roboto_condensed.className}>
                    <h1 className="uppercase text-5xl font-bold">Radice</h1>
                </div>
                <div className={roboto_mono.className}>
                    <ul className="flex gap-16">
                        <li className="uppercase">Research & Development</li>
                        <li className="uppercase">Who we are</li>
                    </ul>
                </div>
                <div className={roboto_mono.className}>
                    <a href="/login" className="uppercase">
                        Into Radi Center
                    </a>
                </div>
            </div>
        </nav>
    );
}
