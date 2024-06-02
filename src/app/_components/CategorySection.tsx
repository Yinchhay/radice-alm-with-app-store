"use client";
import { useEffect, useState } from "react";
import { FetchAssociatedProjectsData } from "../api/internal/project/associate/route";
import {
    getProjectsByCategory,
    getProjectsByCategoryReturnType,
} from "../fetch";
import Link from "next/link";
import TechButton from "@/components/TechButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryProjectLogo from "./CategoryProjectLogo";
import SpecialEffectText from "../../components/Effects/SpecialEffectText";
import SpecialEffectSentence from "../../components/Effects/SpecialEffectSentence";
import { PublicCategory } from "../api/public/categories/route";

export default function CategorySection({
    variant = "light",
    category,
}: {
    variant: string;
    category: PublicCategory;
}) {
    const [selectedProject, setSelectedProject] = useState<number>(0);
    const [projects, setProjects] = useState<getProjectsByCategoryReturnType>(
        [],
    );

    useEffect(() => {
        async function loadProjects() {
            const results = await getProjectsByCategory(category.id);
            setProjects(results);
        }
        loadProjects();
    }, []);
    switch (variant) {
        case "light":
            return (
                <>
                    {projects.length > 0 && (
                        <div className="bg-white py-16 min-h-[620px]">
                            <div className="container mx-auto">
                                <h1 className="text-5xl font-bold">
                                    {category.shortName}
                                </h1>
                                <div>
                                    <div className="grid grid-cols-3">
                                        <div className="mt-8">
                                            <CategoryProjectLogo
                                                variant="light"
                                                src={`/api/file?filename=${projects[selectedProject].logoUrl}`}
                                            />
                                            <h2 className="font-bold text-4xl mt-8 truncate text-ellipsis">
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
                                            <p className="mt-2 mb-12 line-clamp-4">
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
                                        <div></div>
                                        <div className="flex">
                                            <div>
                                                <h3 className="mb-2">
                                                    {category.name}:
                                                </h3>
                                                <ul className="grid grid-cols-5 gap-4">
                                                    {projects.map(
                                                        (project, i) => {
                                                            return (
                                                                <li
                                                                    key={`${category.name}-${project.name}-${project.id}`}
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            setSelectedProject(
                                                                                i,
                                                                            )
                                                                        }
                                                                        className={[
                                                                            "border transition-all",
                                                                            selectedProject ==
                                                                            i
                                                                                ? "border-gray-400"
                                                                                : "border-transparent ",
                                                                        ].join(
                                                                            " ",
                                                                        )}
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
                                                                                    ? "scale-[85%]"
                                                                                    : "hover:scale-[90%]",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                            alt=""
                                                                        />
                                                                    </button>
                                                                </li>
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
                    {projects.length > 0 && (
                        <div className="bg-black py-16 text-white min-h-[620px]">
                            <div className="container mx-auto">
                                <div className="grid grid-cols-3">
                                    <div></div>
                                    <div></div>
                                    <h1 className="text-5xl font-bold">
                                        {category.shortName}
                                    </h1>
                                </div>

                                <div>
                                    <div className="grid grid-cols-3">
                                        <div className="flex">
                                            <div>
                                                <h3 className="mb-2">
                                                    {category.name}:
                                                </h3>
                                                <ul className="grid grid-cols-5 gap-4">
                                                    {projects.map(
                                                        (project, i) => {
                                                            return (
                                                                <li
                                                                    key={`${category.name}-${project.name}-${project.id}`}
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            setSelectedProject(
                                                                                i,
                                                                            )
                                                                        }
                                                                        className={[
                                                                            "border transition-all",
                                                                            selectedProject ==
                                                                            i
                                                                                ? "border-gray-400"
                                                                                : "border-transparent ",
                                                                        ].join(
                                                                            " ",
                                                                        )}
                                                                    >
                                                                        <ImageWithFallback
                                                                            src={`/api/file?filename=${project.logoUrl}`}
                                                                            width={
                                                                                80
                                                                            }
                                                                            height={
                                                                                80
                                                                            }
                                                                            className={[
                                                                                "aspect-square object-cover transition-all border border-gray-900",
                                                                                selectedProject ==
                                                                                i
                                                                                    ? "scale-[85%]"
                                                                                    : "",
                                                                            ].join(
                                                                                " ",
                                                                            )}
                                                                            alt=""
                                                                        />
                                                                    </button>
                                                                </li>
                                                            );
                                                        },
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <div></div>
                                        <div className="mt-8">
                                            <CategoryProjectLogo
                                                variant="dark"
                                                src={`/api/file?filename=${projects[selectedProject].logoUrl}`}
                                            />
                                            <h2 className="font-bold text-4xl mt-8 truncate text-ellipsis">
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
                                            <p className="mt-2 mb-12 line-clamp-4">
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
