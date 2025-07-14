import { Suspense } from "react";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import { SuccessResponse } from "@/lib/response";
import { getAuthUser } from "@/auth/lucia";
import { fileToUrl } from "@/lib/file";
import ImageWithFallback from "@/components/ImageWithFallback";
import Chip from "@/components/Chip";
import { fetchAssociatedProjects } from "../projects/fetch";
import { FetchProjectsForManageAllProjectsData } from "@/app/api/internal/project/route";
import ToggleProjectPublic from "./toggle_project_public";
import ToggleAppPublic from "./toggle_app_public";
import ToggleAppPriority from "./toggle_app_priority";
import NoProject from "./no_project";
import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
import Loading from "@/components/Loading";
import Link from "next/link";
import Button from "@/components/Button";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { AllPermissionsInTheSystem } from "@/lib/IAM";
import { PermissionNames } from "@/lib/client_IAM";

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

    const result = await fetchAssociatedProjects(
        page,
        4,
        searchParams?.search,
    );
    if (!result.success) {
        console.error(result.message);
        throw new Error(result.message);
    }

    // Check permission for the user
    const changeProjectStatusPermission = await hasPermission(
        user.id,
        new Set([Permissions.CHANGE_PROJECT_STATUS])
    );
    const canEditAnyProject = changeProjectStatusPermission.canAccess;

    // Fetch all permissions for the user
    const allUserPermissions = await hasPermission(
        user.id,
        AllPermissionsInTheSystem,
        { checkAllRequiredPermissions: true }
    );

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
                    <div className="py-4 flex flex-col gap-4">
                        {result.data.projects.map((project) => (
                            <Project key={project.id} project={project} user={user} canEditAnyProject={canEditAnyProject} />
                        ))}
                    </div>
                ) : (
                    <NoProject search={searchParams?.search} page={page} />
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
    project,
    user,
    canEditAnyProject,
}: {
    project: SuccessResponse<FetchProjectsForManageAllProjectsData>["data"]["projects"][number] & {
        projectCategories?: { category: { id: number; name: string } }[];
        apps?: { status: string | null }[];
    };
    user: { id: string; type: string };
    canEditAnyProject: boolean;
}) {
    // Check if the project has any accepted apps
    const hasAcceptedApp = Array.isArray(project.apps) && project.apps.some(app => app.status === "accepted");
    // Permission check
    const { projectRole } = checkProjectRole(user.id, project, user.type);
    const canShowToggles = projectRole === ProjectRole.OWNER || projectRole === ProjectRole.SUPER_ADMIN || canEditAnyProject;

    return (
        <Card square className="p-6 h-[200px] flex overflow-hidden">
            {/* Project Logo */}
            <div className="h-full aspect-square flex-shrink-0">
                <ImageWithFallback
                    className="w-full h-full object-cover bg-white rounded-lg"
                    src={fileToUrl(project.logoUrl) || "/placeholder.svg"}
                    alt="project logo"
                    width={200}
                    height={200}
                />
            </div>

            {/* Project Info + Toggle Buttons */}
            <div className="flex flex-1 pl-6 gap-6">
                {/* Info */}
                <div className="flex flex-col gap-4 flex-1 min-w-0">
                    <div className="flex gap-2 flex-wrap">
                        {(project.projectCategories || []).map((catJoin) => (
                            <Chip
                                key={catJoin.category.id}
                                textClassName="text-[#7F56D9] font-bold text-sm"
                                bgClassName="bg-transparent"
                                className="px-0"
                            >
                                {catJoin.category.name}
                            </Chip>
                        ))}
                    </div>
                    <h1 className="text-black font-semibold text-xl leading-6">{project.name}</h1>
                    <p className="text-black/64 text-sm leading-5 line-clamp-3 overflow-hidden">{project.description}</p>
                </div>

                {/* Toggles - Now stacked vertically, only if allowed */}
                {canShowToggles && (
                    <div className="flex flex-col justify-between items-end h-full py-2 gap-2">
                        {/* Project Public Toggle */}
                        <div className="flex items-center gap-2 w-full justify-end">
                            <span className="text-xs text-gray-500">Project</span>
                            <ToggleProjectPublic project={project} />
                        </div>
                        {/* App Toggle */}
                        <div className="flex items-center gap-2 w-full justify-end">
                            {hasAcceptedApp ? (
                                <>
                                    <span className="text-xs text-gray-500">App</span>
                                    <ToggleAppPublic project={project} />
                                </>
                            ) : (
                                <div className="flex flex-col items-end">
                                    <Link href={`/dashboard/projects/${project.id}/app-builder`}>
                                        <Button className="text-sm px-2 py-1">Create App</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                        {/* App Priority Toggle */}
                        {hasAcceptedApp && (
                            <div className="flex items-center gap-2 w-full justify-end">
                                <span className="text-xs text-gray-500">Priority</span>
                                <ToggleAppPriority project={project} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
