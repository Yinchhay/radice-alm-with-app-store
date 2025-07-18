"use client";
import { useEffect, useState } from "react";
import { fetchPublicProjectsByCategory } from "../fetch";
import TechButton from "@/components/TechButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryProjectLogo from "./CategoryProjectLogo";
import SpecialEffectText from "../../components/effects/SpecialEffectText";
import SpecialEffectSentence from "../../components/effects/SpecialEffectSentence";
import { PublicCategory } from "../api/public/categories/route";
import { Roboto_Condensed, Roboto_Flex } from "next/font/google";
import { CategoryAndProjects } from "@/repositories/project";
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function CategorySection({
    variant = "light",
    category,
}: {
    variant: string;
    category: CategoryAndProjects;
}) {
    const [selectedProject, setSelectedProject] = useState<number>(0);
    const [projects, setProjects] = useState(category.projects);

    switch (variant) {
        case "light":
            return (
                <>
                    {projects && projects.length > 0 && (
                        <div
                            className="bg-white py-8 lg:py-16 min-h-[400px] lg:min-h-[700px]"
                            id={`${category.name}`}
                        >
                            <div className="container mx-auto px-4">
                                <h2
                                    className={[
                                        "text-3xl md:text-4xl lg:text-6xl font-bold",
                                        roboto_condensed.className,
                                    ].join(" ")}
                                >
                                    {category.name}
                                </h2>
                                <div>
                                    <div className="flex flex-col lg:flex-row lg:justify-between mt-6 lg:mt-8 gap-8">
                                        <div className="w-full lg:w-[600px]">
                                            <CategoryProjectLogo
                                                variant="light"
                                                src={`/api/file?filename=${projects[selectedProject].logoUrl}`}
                                            />
                                            <h2
                                                className={[
                                                    "font-bold text-2xl md:text-3xl lg:text-4xl mt-6 lg:mt-8 break-words max-w-full lg:max-w-[600px]",
                                                    roboto_condensed.className,
                                                ].join(" ")}
                                            >
                                                <SpecialEffectText
                                                    delay={50}
                                                    shuffleSpeed={15}
                                                    randomAmount={1}
                                                    originalText={
                                                        projects[
                                                            selectedProject
                                                        ].name
                                                    }
                                                />
                                            </h2>
                                            <p className="mt-2 mb-8 lg:mb-12 line-clamp-6 max-w-full lg:max-w-[510px]">
                                                <SpecialEffectSentence
                                                    delay={50}
                                                    shuffleSpeed={25}
                                                    randomAmount={12}
                                                    originalText={
                                                        projects[
                                                            selectedProject
                                                        ].description ||
                                                        "This project does not have a description."
                                                    }
                                                />
                                            </p>
                                            <TechButton
                                                variant="dark"
                                                link={`/project/${projects[selectedProject].id}`}
                                                text="VIEW"
                                            />
                                        </div>
                                        <div className="w-full lg:w-[600px] order-first lg:order-last">
                                            <div className="w-full lg:w-[480px] lg:ml-auto">
                                                <div className="ml-2 flex mb-2">
                                                    <h3
                                                        className={[
                                                            "border-b-[3px] border-black pb-[2px] uppercase text-sm lg:text-base",
                                                            roboto_flex.className,
                                                        ].join(" ")}
                                                    >
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                <ul className="grid grid-cols-5 gap-0">
                                                    {projects.map(
                                                        (project, i) => {
                                                            return (
                                                                <button
                                                                    onClick={() => setSelectedProject(i)}
                                                                    className="transition-all group cursor-pointer p-2 relative"
                                                                    key={`${category.name}-${project.name}-${project.id}`}
                                                                >
                                                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
                                                                        <ImageWithFallback
                                                                            src={`/api/file?filename=${project.logoUrl}` || "/placeholders/placeholder.png"}
                                                                            width={80}
                                                                            height={80}
                                                                            className={["aspect-square object-cover duration-200 border border-gray-200 bg-white w-full h-full", selectedProject == i ? "scale-[90%]" : "group-hover:scale-[90%]"].join(" ")}
                                                                            alt=""
                                                                        />
                                                                        <div className="absolute inset-0 pointer-events-none">
                                                                            <div className={["duration-150 group-active:duration-75 border-t border-l border-black w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "top-0 left-0 opacity-0" : "top-0 left-0"].join(" ")}></div>
                                                                            <div className={["duration-150 group-active:duration-75 border-b border-l border-black w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "bottom-0 left-0 opacity-0" : "bottom-0 left-0"].join(" ")}></div>
                                                                            <div className={["duration-150 group-active:duration-75 border-t border-r border-black w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "top-0 right-0 opacity-0" : "top-0 right-0"].join(" ")}></div>
                                                                            <div className={["duration-150 group-active:duration-75 border-b border-r border-black w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "bottom-0 right-0 opacity-0" : "bottom-0 right-0"].join(" ")}></div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
        case "dark":
            return (
                <>
                    {projects && projects.length > 0 && (
                        <div
                            className="bg-black py-8 lg:py-16 text-white min-h-[400px] lg:min-h-[700px]"
                            id={`${category.name}`}
                        >
                            <div className="container mx-auto px-4">
                                <div className="flex justify-start lg:justify-end">
                                    <div className="w-full lg:w-[600px]">
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                            {category.name}
                                        </h2>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-col lg:flex-row lg:justify-between mt-6 lg:mt-8 gap-8">
                                        <div className="w-full lg:w-[600px] order-last lg:order-first">
                                            <div className="w-full lg:w-[480px]">
                                                <div className="ml-2 flex mb-2">
                                                    <h3 className="border-b-[3px] border-white pb-[2px] uppercase text-sm lg:text-base">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                <ul className="grid grid-cols-5 gap-0">
                                                    {projects.map(
                                                        (project, i) => {
                                                            return (
                                                                <button
                                                                    onClick={() => setSelectedProject(i)}
                                                                    className="transition-all group cursor-pointer p-2 relative"
                                                                    key={`${category.name}-${project.name}-${project.id}`}
                                                                >
                                                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
                                                                        <ImageWithFallback
                                                                            src={`/api/file?filename=${project.logoUrl}` || "/placeholders/placeholder.png"}
                                                                            width={80}
                                                                            height={80}
                                                                            className={["aspect-square object-cover duration-200 border border-gray-100/25 bg-white w-full h-full", selectedProject == i ? "scale-[90%]" : "group-hover:scale-[90%]"].join(" ")}
                                                                            alt=""
                                                                        />
                                                                        <div className="absolute inset-0 pointer-events-none">
                                                                            <div className={["duration-150 group-active:duration-75 border-t border-l border-white w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "top-0 left-0 opacity-0" : "top-0 left-0"].join(" ")}></div>
                                                                            <div className={["duration-150 group-active:duration-75 border-b border-l border-white w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "bottom-0 left-0 opacity-0" : "bottom-0 left-0"].join(" ")}></div>
                                                                            <div className={["duration-150 group-active:duration-75 border-t border-r border-white w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "top-0 right-0 opacity-0" : "top-0 right-0"].join(" ")}></div>
                                                                            <div className={["duration-150 group-active:duration-75 border-b border-r border-white w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-transparent absolute", selectedProject != i ? "bottom-0 right-0 opacity-0" : "bottom-0 right-0"].join(" ")}></div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-[600px] order-first lg:order-last">
                                            <CategoryProjectLogo
                                                variant="dark"
                                                src={`/api/file?filename=${projects[selectedProject].logoUrl}`}
                                            />
                                            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mt-6 lg:mt-8 break-words max-w-full lg:max-w-[600px]">
                                                <SpecialEffectText
                                                    delay={50}
                                                    shuffleSpeed={15}
                                                    randomAmount={1}
                                                    originalText={
                                                        projects[
                                                            selectedProject
                                                        ].name
                                                    }
                                                />
                                            </h2>
                                            <p className="mt-2 mb-8 lg:mb-12 line-clamp-6 max-w-full lg:max-w-[510px]">
                                                <SpecialEffectSentence
                                                    delay={50}
                                                    shuffleSpeed={25}
                                                    randomAmount={12}
                                                    originalText={
                                                        projects[
                                                            selectedProject
                                                        ].description ||
                                                        "This project does not have a description."
                                                    }
                                                />
                                            </p>
                                            <TechButton
                                                variant="light"
                                                link={`/project/${projects[selectedProject].id}`}
                                                text="VIEW"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
    }
}
