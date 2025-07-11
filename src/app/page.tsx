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
import {
    fetchPublicCategories,
    fetchPublicProjectsAndCategories,
} from "./fetch";
import CategorySectionNew from "./_components/CategorySectionNew";
import ProjectPipeline from "./_components/ProjectPipeline";
import { Metadata } from "next";
import Link from "next/link";

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
export const metadata: Metadata = {
    title: "Home - Radice",
    description:
        "Radice is a center for applied research and development initiatives of Paragon International University. We are a hub of creativity and discovery, where ideas take flight and possibilities are endless. Radice is passionate about innovation and creativity, and strives to deliver high-quality results.",
};

export default async function Home() {
    const result = await fetchPublicProjectsAndCategories();

    if (!result.success) {
        return;
    }

    const categoriesAndProjects = result.data.categories;
    //console.log(categoriesAndProjects);
    return (
        <div>
            <Navbar />
            <div className="relative">
                <Image
                    alt="Radice"
                    src={"/ui/paragon.svg"}
                    width={240}
                    height={784}
                    className="absolute right-0 lg:left-0 mt-[58px] w-[180px] h-[588px] lg:w-[240px] lg:h-[784px]"
                />
            </div>
            <div className="min-h-[500px] md:min-h-[600px] lg:h-[690px] container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                <div className="w-full max-w-full lg:w-[560px] flex flex-col justify-center lg:justify-end h-full py-8 lg:pb-16">
                    <div className={roboto_condensed.className}>
                        <div className="overflow-hidden">
                            <h2 className="uppercase text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.90] translate-y-[100%] animate-reveal">
                                Where Ideas<br></br>Come to Life
                            </h2>
                        </div>
                    </div>
                    <div className={roboto.className}>
                        <h1 className="opacity-0 fixed pointer-events-none">
                            Radice: a center for applied research and
                            development initiatives of Paragon International
                            University.
                        </h1>
                        <p className="text-sm sm:text-base mt-4 max-w-full lg:max-w-none">
                            Radice is a center for applied research and
                            development initiatives of{" "}
                            <span>
                                <Link
                                    href="https://paragoniu.edu.kh/"
                                    target="_blank"
                                    className="hover:underline"
                                >
                                    Paragon International University
                                </Link>
                            </span>
                            . We are a hub of creativity and discovery, where
                            ideas take flight and possibilities are endless.
                            Radice is passionate about innovation and
                            creativity, and strives to deliver high-quality
                            results.
                        </p>
                    </div>
                    <div className={roboto_flex.className}>
                        <div className="flex flex-col sm:flex-row relative mt-8 lg:mt-12 items-start sm:items-center gap-4 sm:gap-0">
                            <TechButton
                                link="#r&d"
                                variant="dark"
                                text="R & D"
                            />
                            <div className="sm:ml-6 relative">
                                <div className="w-20 sm:w-24 text-xs sm:text-sm h-[30px] sm:h-[36px] leading-[1.25]">
                                    <RandomText originalText={"RESEARCH &"} />
                                    <RandomText originalText={"DEVELOPMENT"} />
                                </div>
                                <div className="bg-black h-[3px] w-0 animate-load"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mt-[300px] hidden lg:block">
                    <Eye />
                </div>
            </div>
            <div className="relative bg-black pt-4 pb-8" id="r&d">
                <div
                    className="absolute top-[-48px] bg-black w-12 h-12"
                    style={{
                        clipPath: "polygon(0 0, 0% 100%, 100% 100%)",
                    }}
                ></div>
                <Carousel categories={categoriesAndProjects} />
            </div>
            {categoriesAndProjects.map((category, i) => {
                return (
                    <CategorySection
                        variant={i % 2 === 0 ? "light" : "dark"}
                        category={category}
                        key={`category-section-${i}`}
                    />
                );
            })}
            {categoriesAndProjects.length > 0 && (
                <ProjectPipeline category={categoriesAndProjects} />
            )}
            <Footer />
        </div>
    );
}
