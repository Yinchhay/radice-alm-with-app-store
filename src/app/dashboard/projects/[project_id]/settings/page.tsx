import { getAuthUser } from "@/auth/lucia";
import { fetchOneAssociatedProject } from "../builder/fetch";
import ProjectDetail from "./project_detail";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import ProjectMember from "./project_member";
import ProjectPartner from "./project_partner";
import { ProjectPipeline } from "./project_pipeline";
import ProjectFile from "./project_file";
import ProjectLink from "./project_link";
import { ProjectControl } from "./project_control";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import { IconEye, IconHammer } from "@tabler/icons-react";
import Tooltip from "@/components/Tooltip";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
export const metadata: Metadata = {
    title: "Project Setting - Dashboard - Radice",
};
type Params = {
    project_id: string;
};

export default async function ProjectSettings({ params }: { params: Params }) {
    const user = await getAuthUser();
    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    const result = await fetchOneAssociatedProject(params.project_id);
    if (!result.success) {
        redirect("/dashboard");
    }

    if (!result.data.project) {
        redirect("/dashboard");
    }

    const { projectRole } = checkProjectRole(
        user.id,
        result.data.project,
        user.type,
    );
    if (
        projectRole !== ProjectRole.OWNER &&
        projectRole !== ProjectRole.SUPER_ADMIN
    ) {
        redirect("/dashboard");
    }

    const originalProjectCategories = result.data.project.projectCategories.map(
        (projectCategory) => projectCategory.category,
    );

    const originalProjectMembers = result.data.project.projectMembers.map(
        (projectMember) => projectMember.user,
    );

    const originalProjectPartners = result.data.project.projectPartners.map(
        (projectPartner) => projectPartner.partner,
    );

    return (
        <div className="w-full max-w-[1000px] mx-auto bg-transparent z-10 relative">
            <DashboardPageTitle title="Project Settings" className="mb-4" />
            <div className="grid gap-4">
                <ProjectDetail
                    project={result.data.project}
                    originalProjectCategories={originalProjectCategories}
                />
                <ProjectMember
                    project={result.data.project}
                    originalProjectMembers={originalProjectMembers}
                />
                <ProjectPartner
                    project={result.data.project}
                    originalProjectPartners={originalProjectPartners}
                />
                <ProjectPipeline project={result.data.project} />
                <ProjectFile project={result.data.project} />
                <ProjectLink project={result.data.project} />
                <ProjectControl project={result.data.project} />
            </div>
            {projectRole == ProjectRole.OWNER && (
                <div className="fixed bottom-8 right-8 z-30 grid gap-2">
                    <Tooltip title="Preview" position="left">
                        <Link href={`/dashboard/projects/${params.project_id}`}>
                            <Button square>
                                <IconEye size={32} stroke={1.5} />
                            </Button>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Builder" position="left">
                        <Link
                            href={`/dashboard/projects/${params.project_id}/builder`}
                        >
                            <Button square>
                                <IconHammer size={32} stroke={1.5} />
                            </Button>
                        </Link>
                    </Tooltip>
                </div>
            )}
        </div>
    );
}
