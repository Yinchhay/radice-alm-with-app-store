"use client";
import { useEffect, useState } from "react";
import { fetchPublicProjectsByCategory } from "../fetch";
import TechButton from "@/components/TechButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryProjectLogo from "./CategoryProjectLogo";
import SpecialEffectText from "../../components/effects/SpecialEffectText";
import SpecialEffectSentence from "../../components/effects/SpecialEffectSentence";
import { PublicCategory } from "../api/public/categories/route";
import { GetPublicProjectsByCategoryReturnType } from "../api/public/categories/[category_id]/projects/route";
import { Roboto_Condensed, Roboto_Flex } from "next/font/google";
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
    category: PublicCategory;
}) {
    const [selectedProject, setSelectedProject] = useState<number>(0);
    const [projects, setProjects] =
        useState<GetPublicProjectsByCategoryReturnType>();

    useEffect(() => {
        async function loadProjects() {
            const results = await fetchPublicProjectsByCategory(category.id);
            if (results.success) {
                setProjects(results.data.projects);
            }
        }
        loadProjects();
    }, []);

    switch (variant) {
        case "light":
            return (
                <>
                    {projects && projects.length > 0 && (
                        <div className="bg-white py-16 min-h-[620px]">
                            <div className="container mx-auto">
                                <h1
                                    className={[
                                        "text-6xl font-bold",
                                        roboto_condensed.className,
                                    ].join(" ")}
                                >
                                    {category.shortName}
                                </h1>
                                <div>
                                    <div className="flex justify-between mt-8">
                                        <div className="w-[600px]">
                                            <CategoryProjectLogo
                                                variant="light"
                                                src={`/api/file?filename=${projects[selectedProject].logoUrl}`}
                                            />
                                            <h2
                                                className={[
                                                    "font-bold text-4xl mt-8 break-words max-w-[600px]",
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
                                            <p className="mt-2 mb-12 line-clamp-4 max-w-[500px]">
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
                                        <div className="w-[600px]">
                                            <div className="w-[480px]">
                                                <div className="ml-2 flex mb-2">
                                                    <h3
                                                        className={[
                                                            "border-b-[3px] border-black pb-[2px] uppercase",
                                                            roboto_flex.className,
                                                        ].join(" ")}
                                                    >
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                <ul className="grid grid-cols-5">
                                                    {projects.map(
                                                        (project, i) => {
                                                            return (
                                                                <button
                                                                    onClick={() =>
                                                                        setSelectedProject(
                                                                            i,
                                                                        )
                                                                    }
                                                                    className={[
                                                                        "transition-all relative group cursor-pointer p-2",
                                                                    ].join(" ")}
                                                                    key={`${category.name}-${project.name}-${project.id}`}
                                                                >
                                                                    <ImageWithFallback
                                                                        src={
                                                                            `/api/file?filename=${project.logoUrl}` ||
                                                                            "/placeholder.webp"
                                                                        }
                                                                        width={
                                                                            80
                                                                        }
                                                                        height={
                                                                            80
                                                                        }
                                                                        className={[
                                                                            "aspect-square object-cover duration-200 border border-gray-200",
                                                                            selectedProject ==
                                                                            i
                                                                                ? "scale-[90%]"
                                                                                : "group-hover:scale-[90%]",
                                                                        ].join(
                                                                            " ",
                                                                        )}
                                                                        alt=""
                                                                    />{" "}
                                                                    <div className="w-[80px] h-[80px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-t border-l border-black w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "top-[-.4rem] left-[-.4rem] opacity-0"
                                                                                    : "top-[-.15rem] left-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-b border-l border-black w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "bottom-[-.4rem] left-[-.4rem] opacity-0"
                                                                                    : "bottom-[-.15rem] left-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-t border-r border-black w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "top-[-.4rem] right-[-.4rem] opacity-0"
                                                                                    : "top-[-.15rem] right-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-b border-r border-black w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "bottom-[-.4rem] right-[-.4rem] opacity-0"
                                                                                    : "bottom-[-.15rem] right-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
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
                        <div className="bg-black py-16 text-white min-h-[620px]">
                            <div className="container mx-auto">
                                <div className="flex justify-end">
                                    <div className="w-[600px]">
                                        <h1 className="text-5xl font-bold">
                                            {category.shortName}
                                        </h1>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mt-8">
                                        <div className="w-[600px]">
                                            <div className="w-[480px]">
                                                <div className="ml-2 flex mb-2">
                                                    <h3 className="border-b-[3px] border-white pb-[2px] uppercase">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                <ul className="grid grid-cols-5">
                                                    {projects.map(
                                                        (project, i) => {
                                                            return (
                                                                <button
                                                                    onClick={() =>
                                                                        setSelectedProject(
                                                                            i,
                                                                        )
                                                                    }
                                                                    className={[
                                                                        "transition-all relative group cursor-pointer p-2",
                                                                    ].join(" ")}
                                                                    key={`${category.name}-${project.name}-${project.id}`}
                                                                >
                                                                    <ImageWithFallback
                                                                        src={
                                                                            `/api/file?filename=${project.logoUrl}` ||
                                                                            "/placeholder.webp"
                                                                        }
                                                                        width={
                                                                            80
                                                                        }
                                                                        height={
                                                                            80
                                                                        }
                                                                        className={[
                                                                            "aspect-square object-cover duration-200 border border-gray-100/25",
                                                                            selectedProject ==
                                                                            i
                                                                                ? "scale-[90%]"
                                                                                : "group-hover:scale-[90%]",
                                                                        ].join(
                                                                            " ",
                                                                        )}
                                                                        alt=""
                                                                    />{" "}
                                                                    <div className="w-[80px] h-[80px] absolute top-2 left-2">
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-t border-l border-white w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "top-[-.4rem] left-[-.4rem] opacity-0"
                                                                                    : "top-[-.15rem] left-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-b border-l border-white w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "bottom-[-.4rem] left-[-.4rem] opacity-0"
                                                                                    : "bottom-[-.15rem] left-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-t border-r border-white w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "top-[-.4rem] right-[-.4rem] opacity-0"
                                                                                    : "top-[-.15rem] right-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
                                                                        <div
                                                                            className={[
                                                                                "duration-150 group-active:duration-75 border-b border-r border-white w-5 h-5 bg-transparent absolute",
                                                                                selectedProject !=
                                                                                i
                                                                                    ? "bottom-[-.4rem] right-[-.4rem] opacity-0"
                                                                                    : "bottom-[-.15rem] right-[-.15rem]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                        ></div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="w-[600px]">
                                            <CategoryProjectLogo
                                                variant="dark"
                                                src={`/api/file?filename=${projects[selectedProject].logoUrl}`}
                                            />
                                            <h2 className="font-bold text-4xl mt-8 break-words max-w-[600px]">
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
                                            <p className="mt-2 mb-12 line-clamp-4 max-w-[500px]">
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
