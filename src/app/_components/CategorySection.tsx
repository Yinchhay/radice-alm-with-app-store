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
                <div className="bg-white">
                    <div className="container mx-auto">
                        <h1 className="text-5xl font-bold">{category.name}</h1>
                        {projects.length > 0 && (
                            <div>
                                <Image
                                    src={
                                        projects[selectedProject].logoUrl
                                            ? (projects[selectedProject]
                                                  .logoUrl as string)
                                            : "/placeholder.webp"
                                    }
                                    width={80}
                                    height={80}
                                    alt=""
                                />
                                <h2>{projects[selectedProject].name}</h2>
                                <p>{projects[selectedProject].description}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        case "dark":
            return <div></div>;
    }
}
