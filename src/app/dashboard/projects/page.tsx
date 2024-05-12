import { Suspense } from "react";
import { CreateProjectOverlay } from "./create_project";
import Pagination from "@/components/Pagination";
import { fetchAssociatedProjects } from "./fetch";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { projectMembers, projects } from "@/drizzle/schema";
import Image from "next/image";

type ManageAssociatedProps = {
    searchParams?: {
        page?: string;
    };
};

export default async function ManageAssociatedProject({
    searchParams,
}: ManageAssociatedProps) {
    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchAssociatedProjects(page, ROWS_PER_PAGE);
    if (!result.success) {
        throw new Error(result.message);
    }

    const ProjectList = result.data.projects.map((project) => {
        return <Project key={project.id} project={project} />;
    });

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <Suspense fallback={"loading..."}>
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl">Projects</h1>
                <CreateProjectOverlay />
            </div>
            {result.data.projects.length > 0 ? (
                ProjectList
            ) : (
                <NoProject page={page} />
            )}
            {showPagination && (
                <div className="float-right">
                    <Pagination page={page} maxPage={result.data.maxPage} />
                </div>
            )}
        </Suspense>
    );
}

function NoProject({ page }: { page: number }) {
    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl">{`No project found on page ${page}`}</h1>
                <CreateProjectOverlay />
            </div>
        </>
    );
}

function Project({ project }: { project: typeof projects.$inferSelect }) {
    // TODO: fix ui
    return (
        <div className="">
            <div className="flex flex-row">
                <Image
                    src={project.logoUrl || "/placeholder.webp"}
                    alt={"project logo"}
                    width={128}
                    height={128}
                />
                <div className="flex">
                    <div className="flex flex-col">
                        <h1>{project.name}</h1>
                        <p>{project.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
