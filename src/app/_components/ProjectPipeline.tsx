"use client";
import { Roboto_Condensed, Roboto_Flex } from "next/font/google";
import {
    CategoryAndProjects,
    ProjectFromCategory,
} from "@/repositories/project";
import PipelineProjectLogo from "./PipelineProjectLogo";
import Link from "next/link";
import { useEffect } from "react";
const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

interface PipelineStatus {
    live: boolean;
    test: boolean;
    build: boolean;
    design: boolean;
    release: boolean;
    retired: boolean;
    analysis: boolean;
    approved: boolean;
    retiring: boolean;
    chartered: boolean;
    definition: boolean;
    development: boolean;
    requirements: boolean;
}

export default function ProjectPipeline({
    category,
}: {
    category: CategoryAndProjects[];
}) {
    const statusOrder: (keyof PipelineStatus)[] = [
        "requirements",
        "definition",
        "development",
        "design",
        "analysis",
        "approved",
        "chartered",
        "build",
        "test",
        "release",
        "live",
        "retiring",
        "retired",
    ];
    function getUniqueProjects(
        categories: CategoryAndProjects[],
    ): ProjectFromCategory[] {
        const uniqueProjectsMap: { [key: number]: ProjectFromCategory } = {};

        categories.forEach((category) => {
            category.projects.forEach((project) => {
                if (!uniqueProjectsMap[project.id]) {
                    uniqueProjectsMap[project.id] = project;
                }
            });
        });

        return Object.values(uniqueProjectsMap);
    }
    const uniqueProjects = getUniqueProjects(category);

    function organizeProjectsByPipelineStatus(
        projects: ProjectFromCategory[],
    ): { [status: string]: ProjectFromCategory[] } {
        const result: { [status: string]: ProjectFromCategory[] } = {};

        for (const project of projects) {
            if (!project.pipelineStatus) continue;

            let mainStatus: keyof PipelineStatus | null = null;

            // Find the latest (most significant) status that is true
            for (const status of statusOrder) {
                if (project.pipelineStatus[status]) {
                    mainStatus = status;
                }
            }

            if (mainStatus) {
                // Initialize the array for this status if it doesn't exist
                if (!result[mainStatus]) {
                    result[mainStatus] = [];
                }

                // Push the project into the appropriate status array
                result[mainStatus].push(project);
            }
        }

        return result;
    }

    const pipeline = organizeProjectsByPipelineStatus(uniqueProjects);
    const hasProjects = Object.keys(pipeline).length > 0;
    return (
        <>
            {hasProjects && (
                <div className="bg-black py-8 lg:py-16 text-white">
                    <div className="container mx-auto px-4">
                        <h2
                            className={`text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 ${roboto_condensed.className}`}
                        >
                            Project Pipeline
                        </h2>
                        <div className="py-4">
                            {statusOrder.map((status, index) => (
                                <div key={status}>
                                    {pipeline[status] && (
                                        <div
                                            className={`grid grid-cols-1 lg:grid-cols-6 border-white border-b ${index === statusOrder.length - 1 ? "border-b-0" : ""}`}
                                        >
                                            <div className="grid place-items-start lg:place-items-center lg:border-r border-white">
                                                <h3
                                                    className={`text-xl lg:text-2xl font-bold p-3 lg:p-4 ${roboto_condensed.className}`}
                                                >
                                                    {status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        status.slice(1)}
                                                </h3>
                                            </div>
                                            <ul className="lg:col-span-5 p-3 lg:p-4 flex flex-wrap gap-3 lg:gap-4">
                                                {pipeline[status].map(
                                                    (project) => (
                                                        <Link
                                                            href={`/project/${project.id}`}
                                                            key={
                                                                "pipeline-project-" +
                                                                project.id
                                                            }
                                                        >
                                                            <PipelineProjectLogo
                                                                src={`/api/file?filename=${project.logoUrl}`}
                                                            />
                                                            <h4 className="text-center font-bold break-words max-w-[100px]">
                                                                {project.name}
                                                            </h4>
                                                        </Link>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
