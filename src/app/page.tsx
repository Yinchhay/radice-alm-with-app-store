import Image from "next/image";
import { Roboto_Condensed, Roboto_Flex, Roboto } from "next/font/google";
import GlitchText from "@/components/GlitchText";
import Navbar from "@/components/Navbar";
import RandomText from "@/components/effects/RandomText";
import { useEffect } from "react";
import Eye from "@/components/Eye";
import Carousel from "@/app/_components/Carousel";
import CategorySection from "./_components/CategorySection";
import { categories } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import Footer from "@/components/Footer";
import TechButton from "@/components/TechButton";
import { fetchPublicCategories } from "./fetch";
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

export const dynamic = "force-dynamic";

export default async function Home() {
    const result = await fetchPublicCategories();

    if (!result.success) {
        return;
    }

    const categories = result.data.categories;
    return (
        <div>
            <Navbar />
            <div className="relative">
                <Image
                    alt=""
                    src={"/paragon.svg"}
                    width={240}
                    height={784}
                    className="absolute left-0 mt-[50px]"
                />
            </div>
            {/* <div className="container mx-auto overflow-hidden max-w-[80vw]">
                <div className={roboto.className}>
                    <div
                        className="absolute top-[100px] font-bold text-[300px] text-transparent select-none"
                        style={{
                            WebkitTextStroke: "3px rgba(0,0,0,.08)",
                            WebkitTextFillColor: "transparent",
                            WebkitFontSmoothing: "antialiased",
                        }}
                    >
                        <RandomText originalText={"WE ARE"} />
                    </div>
                    <div
                        className="absolute top-[400px] left-[800px] font-bold text-[300px] text-transparent select-none"
                        style={{
                            WebkitTextStroke: "3px rgba(0,0,0,.08)",
                            WebkitFontSmoothing: "antialiased",
                        }}
                    >
                        <RandomText originalText={"RADICE"} />
                    </div>
                </div>
            </div> */}
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
                        <p className="text mt-4">
                            At Radice, innovation is our heartbeat. We are a hub
                            of creativity and discovery, where ideas take flight
                            and possibilities are endless. Join us in shaping
                            the future. Welcome to Radice.
                        </p>
                    </div>
                    <div className={roboto_flex.className}>
                        <div className="flex relative mt-12 items-center">
                            <TechButton variant="dark" text="R & D" />
                            <div className="ml-6 relative">
                                <div className="w-24 text-sm h-[36px] leading-[1.25]">
                                    <RandomText originalText={"RESEARCH &"} />
                                    <RandomText originalText={"DEVELOPMENT"} />
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
            <div className="relative bg-black pt-4 pb-8">
                <div
                    className="absolute top-[-48px] bg-black w-12 h-12"
                    style={{
                        clipPath: "polygon(0 0, 0% 100%, 100% 100%)",
                    }}
                ></div>
                <Carousel categories={categories} />
            </div>
            {categories.map((category, i) => {
                return (
                    <CategorySection
                        variant={i % 2 === 0 ? "light" : "dark"}
                        category={category}
                        key={`category-section-${i}`}
                    />
                );
            })}
            <Footer />
        </div>
    );
}
