import Image from "next/image";
import { Roboto_Condensed, Roboto_Flex, Roboto } from "next/font/google";
import GlitchText from "@/components/GlitchText";
const roboto_condensed = Roboto_Condensed({
    weight: "700",
    subsets: ["latin"],
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export default function Home() {
    return (
        <div className="container m-auto">
            <div className="relative grid grid-cols-2 gap-24 p-24">
                <div className="grid">
                    <div className={roboto_condensed.className}>
                        <div className="overflow-hidden">
                            <h1 className="text-[96px] font-bold translate-y-[100%] animate-reveal">
                                REVEAL TEXT
                            </h1>
                        </div>
                    </div>
                    <div className={roboto_flex.className}>
                        <GlitchText />
                    </div>
                </div>
                <div className="relative">
                    <div className="grid h-full w-full absolute">
                        <div
                            style={{
                                maskImage: "url(/root.png)",
                                WebkitMaskImage: "url(/root.png)",
                                WebkitMaskSize: "382px 650px",
                                WebkitMaskRepeat: "no-repeat",
                            }}
                        >
                            <div className="bg-black w-[382px] h-[0] animate-load"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
