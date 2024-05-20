"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FetchAssociatedProjectsData } from "../api/internal/project/associate/route";
import {
    getProjectsByCategory,
    getProjectsByCategoryReturnType,
} from "../fetch";

export default function CategorySection({
    variant = "light",
    category,
}: {
    variant: string;
    category: {
        id: number;
        name: string;
        isActive: boolean | null;
        description: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    };
}) {
    const [selectedProject, setSelectedProject] = useState<number>(0);
    const [projects, setProjects] = useState<getProjectsByCategoryReturnType>(
        [],
    );

    useEffect(() => {
        async function loadProjects() {
            const results = await getProjectsByCategory(category.id);
            setProjects(results);
            console.log(results);
        }
        loadProjects();
    }, []);
    switch (variant) {
        case "light":
            return (
                <>
                    {projects.length > 0 && (
                        <div className="bg-white py-16">
                            <div className="container mx-auto">
                                <h1 className="text-5xl font-bold">
                                    {category.name}
                                </h1>
                                <div>
                                    <div className="grid grid-cols-3">
                                        <div className="mt-8">
                                            <Image
                                                src={
                                                    `/api/file?filename=${projects[selectedProject].logoUrl}` ||
                                                    "/placeholder.webp"
                                                }
                                                width={120}
                                                height={120}
                                                className="aspect-square object-cover border border-gray-200"
                                                alt=""
                                            />
                                            <h2 className="font-bold text-2xl mt-2">
                                                {projects[selectedProject].name}
                                            </h2>
                                            <p className="mt-2 h-[80px]">
                                                {
                                                    projects[selectedProject]
                                                        .description
                                                }
                                            </p>
                                            <div className="relative mt-8">
                                                <button className="py-2 px-12 bg-black text-white text-2xl font-bold">
                                                    VIEW
                                                </button>
                                                <div className="select-none absolute top-1 left-1 py-2 px-12 bg-transparent border-black border text-transparent text-2xl font-bold">
                                                    VIEW
                                                </div>
                                            </div>
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
                                                                        <Image
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
                                                                                "aspect-square object-cover transition-all border border-gray-200",
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
                        <div className="bg-black py-16 text-white">
                            <div className="container mx-auto">
                                <div className="grid grid-cols-3">
                                    <div></div>
                                    <div></div>
                                    <h1 className="text-5xl font-bold">
                                        {category.name}
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
                                                                        <Image
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
                                            <Image
                                                src={
                                                    `/api/file?filename=${projects[selectedProject].logoUrl}` ||
                                                    "/placeholder.webp"
                                                }
                                                width={120}
                                                height={120}
                                                className="aspect-square object-cover border border-gray-800"
                                                alt=""
                                            />
                                            <h2 className="font-bold text-2xl mt-2">
                                                {projects[selectedProject].name}
                                            </h2>
                                            <p className="mt-2 h-[80px]">
                                                {
                                                    projects[selectedProject]
                                                        .description
                                                }
                                            </p>
                                            <div className="relative mt-8">
                                                <button className="py-2 px-12 bg-white text-black text-2xl font-bold">
                                                    VIEW
                                                </button>
                                                <div className="select-none absolute top-1 left-1 py-2 px-12 bg-transparent border-white border text-transparent text-2xl font-bold">
                                                    VIEW
                                                </div>
                                            </div>
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
