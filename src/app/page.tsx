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
        "Radice is a Center for applied research and development initiatives of Paragon International University. We are a hub of creativity and discovery, where ideas take flight and possibilities are endless. Radice is passionate about innovation and creativity, and strives to deliver high-quality results.",
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
                    src={"/paragon.svg"}
                    width={240}
                    height={784}
                    className="absolute left-0 mt-[58px]"
                />
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
                        <h1 className="opacity-0 fixed pointer-events-none">
                            Radice
                        </h1>
                        <p className="text mt-4">
                            Radice is a Center for applied research and
                            development initiatives of Paragon International
                            University. We are a hub of creativity and
                            discovery, where ideas take flight and possibilities
                            are endless. Radice is passionate about innovation
                            and creativity, and strives to deliver high-quality
                            results.
                        </p>
                    </div>
                    <div className={roboto_flex.className}>
                        <div className="flex relative mt-12 items-center">
                            <TechButton
                                link="#r&d"
                                variant="dark"
                                text="R & D"
                            />
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
