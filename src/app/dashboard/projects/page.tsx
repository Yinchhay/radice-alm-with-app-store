import { Suspense } from "react";
import { CreateProjectOverlay } from "./create_project";
import Pagination from "@/components/Pagination";
import { fetchAssociatedProjects } from "./fetch";
import Card from "@/components/Card";
import { IconEye, IconHammer, IconSettings } from "@tabler/icons-react";
import Button from "@/components/Button";
import { SuccessResponse } from "@/lib/response";
import { FetchAssociatedProjectsData } from "@/app/api/internal/project/associate/route";
import Link from "next/link";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import { getAuthUser } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { User } from "lucia";
import { fileToUrl } from "@/lib/file";
import ImageWithFallback from "@/components/ImageWithFallback";
import Chip from "@/components/Chip";
import ChipsHolder from "@/components/ChipsHolder";
import Tooltip from "@/components/Tooltip";
import NoAssociatedProject from "./no_associated_project";
import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
import Loading from "@/components/Loading";

export const metadata: Metadata = {
    title: "Manage Projects - Dashboard - Radice",
};

type ManageAssociatedProps = {
    searchParams?: {
        page?: string;
        search?: string;
    };
};

export default async function ManageAssociatedProject({
    searchParams,
}: ManageAssociatedProps) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchAssociatedProjects(page, 4, searchParams?.search);
    if (!result.success) {
        throw new Error(result.message);
    }

    const ProjectLists = result.data.projects.map((project) => {
        return <Project key={project.id} project={project} user={user} />;
    });

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    const { canAccess: canCreateProject } = await hasPermission(
        user.id,
        new Set([Permissions.CREATE_OWN_PROJECTS]),
    );

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={<Loading />}>
                <div className="flex flex-row justify-between">
                    <DashboardPageTitle title="Projects" />
                    {canCreateProject && <CreateProjectOverlay />}
                </div>
                <div className="mt-4">
                    <SearchBar placeholder="Search associated projects" />
                </div>
                {result.data.projects.length > 0 ? (
                    <div className="py-4 w-full flex gap-4 flex-col">
                        {ProjectLists}
                    </div>
                ) : (
                    <NoAssociatedProject page={page} />
                )}
                {showPagination && (
                    <div className="flex justify-end pb-4">
                        <Pagination page={page} maxPage={result.data.maxPage} />
                    </div>
                )}
            </Suspense>
        </div>
    );
}

function Project({
    user,
    project,
}: {
    user: User;
    project: SuccessResponse<FetchAssociatedProjectsData>["data"]["projects"][number];
}) {
    const { canEdit, projectRole } = checkProjectRole(
        user.id,
        project,
        user.type,
    );
    const canViewSettings =
        projectRole === ProjectRole.OWNER ||
        projectRole === ProjectRole.SUPER_ADMIN;

    return (
        <Card square>
            <div className="flex flex-row gap-4 relative">
                <ImageWithFallback
                    className="aspect-square object-cover rounded-sm  w-32 h-32"
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
                    {/* TODO: update link url to preview */}
                    <Tooltip title="Preview" position="top">
                        <Link
                            href={`/dashboard/projects/${project.id}`}
                            prefetch
                        >
                            <Button
                                square
                                variant="outline"
                                className="outline-0 group"
                            >
                                <IconEye
                                    size={28}
                                    className="group-hover:text-blue-500 transition-all"
                                    stroke={1.3}
                                />
                            </Button>
                        </Link>
                    </Tooltip>
                    {canViewSettings && (
                        <Tooltip title="Project setting" position="top">
                            <Link
                                href={`/dashboard/projects/${project.id}/settings`}
                                className="group"
                            >
                                <Button
                                    square
                                    variant="outline"
                                    className="outline-0"
                                >
                                    <IconSettings
                                        size={28}
                                        className="group-hover:text-blue-500 transition-all"
                                        stroke={1.3}
                                    />
                                </Button>
                            </Link>
                        </Tooltip>
                    )}
                    {canEdit && (
                        <Tooltip title="Project content builder" position="top">
                            <Link
                                href={`/dashboard/projects/${project.id}/builder`}
                                className="group"
                            >
                                <Button
                                    square
                                    variant="outline"
                                    className="outline-0"
                                >
                                    <IconHammer
                                        size={28}
                                        className="group-hover:text-blue-500 transition-all"
                                        stroke={1.3}
                                    />
                                </Button>
                            </Link>
                        </Tooltip>
                    )}
                </div>
            </div>
        </Card>
    );
}
