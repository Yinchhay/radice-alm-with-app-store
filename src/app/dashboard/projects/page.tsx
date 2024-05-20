import { Suspense } from "react";
import { CreateProjectOverlay } from "./create_project";
import Pagination from "@/components/Pagination";
import { fetchAssociatedProjects } from "./fetch";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import Image from "next/image";
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

type ManageAssociatedProps = {
    searchParams?: {
        page?: string;
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

    const result = await fetchAssociatedProjects(page, 4);
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
        <div className="w-full max-w-[1000px]">
            <Suspense fallback={"loading..."}>
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl">Projects</h1>
                    {canCreateProject && <CreateProjectOverlay />}
                </div>
                {result.data.projects.length > 0 ? (
                    <div className="my-4 w-full flex gap-4 flex-col">
                        {ProjectLists}
                    </div>
                ) : (
                    <NoProject page={page} />
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

function NoProject({ page }: { page: number }) {
    let message = `No project found on page ${page}`;

    if (page === 1) {
        message = "You are not associated with any project.";
    }

    return (
        <>
            <div className="flex flex-col items-center justify-between gap-4 my-4">
                <h1 className="text-lg">{message}</h1>
            </div>
        </>
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
                <Image
                    className="aspect-square object-cover rounded-sm"
                    src={fileToUrl(project.logoUrl) || "/placeholder.webp"}
                    alt={"project logo"}
                    width={128}
                    height={128}
                />
                <div className="flex pr-8">
                    <div className="flex flex-col">
                        <h1 className="text-xl">{project.name}</h1>
                        <p className="text-sm">{project.description}</p>
                        <div className="flex flex-row gap-2 mt-1">
                            {project.projectCategories.map((categoryJoin) => (
                                <span
                                    key={categoryJoin.id}
                                    className="text-xs bg-gray-200 py-1 px-2 rounded-full"
                                >
                                    {categoryJoin.category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 flex gap-2">
                    {/* TODO: update link url to preview */}
                    <Link href={""}>
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
                    {canViewSettings && (
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
                    )}
                    {canEdit && (
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
                    )}
                </div>
            </div>
        </Card>
    );
}
