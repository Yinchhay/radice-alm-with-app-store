import { Suspense } from "react";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import { SuccessResponse } from "@/lib/response";
import { getAuthUser } from "@/auth/lucia";
import { fileToUrl } from "@/lib/file";
import ImageWithFallback from "@/components/ImageWithFallback";
import Chip from "@/components/Chip";
import ChipsHolder from "@/components/ChipsHolder";
import Tooltip from "@/components/Tooltip";
import { fetchProjectsForManageAllProjects } from "./fetch";
import { FetchProjectsForManageAllProjectsData } from "@/app/api/internal/project/route";
import ToggleProjectPublic from "./toggle_project_public";
import NoProject from "./no_project";
import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
import Loading from "@/components/Loading";
export const metadata: Metadata = {
    title: "Manage All Projects - Dashboard - Radice",
};
type ManageAllProjectsProps = {
    searchParams?: {
        page?: string;
        search?: string;
    };
};

export default async function ManageAllProject({
    searchParams,
}: ManageAllProjectsProps) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchProjectsForManageAllProjects(
        page,
        3,
        searchParams?.search,
    );
    if (!result.success) {
        console.error(result.message);
        throw new Error(result.message);
    }

    const ProjectLists = result.data.projects.map((project) => {
        return <Project key={project.id} project={project} />;
    });

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={<Loading />}>
                <DashboardPageTitle title="All Projects" />
                <div className="mt-4">
                    <SearchBar placeholder="Search projects" />
                </div>
                {result.data.projects.length > 0 ? (
                    <div className="my-4 w-full flex gap-4 flex-col">
                        {ProjectLists}
                    </div>
                ) : (
                    <NoProject search={searchParams?.search} page={page} />
                )}
                {showPagination && (
                    <div className="float-right mb-4">
                        <Pagination page={page} maxPage={result.data.maxPage} />
                    </div>
                )}
            </Suspense>
        </div>
    );
}

function Project({
    project,
}: {
    project: SuccessResponse<FetchProjectsForManageAllProjectsData>["data"]["projects"][number];
}) {
    return (
        <Card square>
            <div className="flex flex-row gap-4 relative">
                <ImageWithFallback
                    className="aspect-square object-cover rounded-sm  w-32 h-32 bg-white"
                    src={fileToUrl(project.logoUrl)}
                    alt={"project logo"}
                    width={128}
                    height={128}
                />
                <div className="flex mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl">{project.name}</h1>
                        <p className="text-sm">{project.description}</p>
                        <ChipsHolder className="mt-1">
                            {Array.isArray(project.projectCategories) &&
                                project.projectCategories.map(
                                    (categoryJoin) => {
                                        return (
                                            <Tooltip
                                                key={categoryJoin.category.id}
                                                title={
                                                    categoryJoin.category.name
                                                }
                                            >
                                                <Chip>
                                                    {categoryJoin.category.name}
                                                </Chip>
                                            </Tooltip>
                                        );
                                    },
                                )}
                        </ChipsHolder>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 flex gap-2">
                    <ToggleProjectPublic project={project} key={project.id} />
                </div>
            </div>
        </Card>
    );
}
