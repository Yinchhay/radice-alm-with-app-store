"use client";
import Image from "next/image";
import { Roboto_Condensed, Roboto_Flex, Roboto } from "next/font/google";
import GlitchText from "@/components/GlitchText";
import Navbar from "@/components/Navbar";
import RandomText from "@/components/RandomText";
import { useEffect } from "react";
import Eye from "@/components/Eye";
const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function Home() {
    // useEffect(() => {
    //     setTimeout(() => {
    //         window.location.reload();
    //     }, 4000);
    // }, []);
    return (
        <div>
            <Navbar />
            <div className="container m-auto">
                <div className={roboto.className}>
                    <div
                        className="absolute top-[100px] uppercase font-bold text-[300px] text-transparent select-none"
                        style={{
                            WebkitTextStroke: "3px rgba(0,0,0,.08)",
                            WebkitTextFillColor: "transparent",
                            WebkitFontSmoothing: "antialiased",
                        }}
                    >
                        We Are
                    </div>
                    <div
                        className="absolute top-[400px] left-[800px] uppercase font-bold text-[300px] text-transparent select-none"
                        style={{
                            WebkitTextStroke: "3px rgba(0,0,0,.08)",
                            WebkitFontSmoothing: "antialiased",
                        }}
                    >
                        Radice
                    </div>
                </div>
            </div>
            <div className="h-[690px] container m-auto grid grid-cols-2">
                <div className="w-[560px] flex flex-col justify-end h-full pb-16">
                    <div className={roboto_condensed.className}>
                        <div className="overflow-hidden">
                            <h1 className="uppercase text-8xl font-bold leading-[0.90] translate-y-[100%] animate-reveal">
                                Where Ideas<br></br>Come to Life
                            </h1>
                        </div>
                    </div>
                    <div className={roboto.className}>
                        <p className="text mt-2">
                            Radice is a company that helps other companies bring
                            their ideas to life through research and
                            development. Radice is passionate about innovation
                            and creativity, and strives to deliver high-quality
                            results
                        </p>
                    </div>
                    <div className={roboto_flex.className}>
                        <div className="flex relative mt-12 items-center">
                            <div>
                                <button className="py-2 px-12 bg-black text-white text-2xl font-bold">
                                    R & D
                                </button>
                                <div className="select-none absolute top-1 left-1 py-2 px-12 bg-transparent border-black border text-transparent text-2xl font-bold">
                                    R & D
                                </div>
                            </div>
                            <div className="ml-6 relative">
                                <div className="w-24 uppercase text-sm h-[36px] leading-[1.25]">
                                    <RandomText originalText={"Research &"} />
                                    <RandomText originalText={"Development"} />
                                </div>
                                <div className="bg-black h-[3px] w-0 animate-load"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mt-[300px]">
                    <Eye />
                </div>
                {/* <div className="relative flex justify-center">
                    <div className="grid absolute top-[-80px]">
                        <div
                            style={{
                                maskImage: "url(/root.png)",
                                WebkitMaskImage: "url(/root.png)",
                                WebkitMaskSize: "382px 650px",
                                WebkitMaskRepeat: "no-repeat",
                            }}
                        >
                            <div className="bg-black w-[382px] h-[0] animate-grow"></div>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="relative bg-black h-[100vh]">
                <div
                    className="absolute top-[-48px] bg-black w-12 h-12"
                    style={{
                        clipPath: "polygon(0 0, 0% 100%, 100% 100%);",
                    }}
                ></div>
            </div>
        </div>
    );
}
