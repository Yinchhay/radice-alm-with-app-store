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
        <div className="w-full max-w-[700px] mx-auto bg-transparent z-10 relative">
            <h1 className="text-3xl font-medium mb-4">Project Settings</h1>
            <div className="grid gap-4">
                <ProjectDetail
                    project={result.data.project}
                    categories={result.data.allCategories}
                    originalProjectCategories={originalProjectCategories}
                />
                <ProjectMember
                    project={result.data.project}
                    usersInTheSystem={result.data.allUsers}
                    originalProjectMembers={originalProjectMembers}
                />
                <ProjectPartner
                    project={result.data.project}
                    originalProjectPartners={originalProjectPartners}
                    partnersInTheSystem={result.data.allPartners}
                />
                <ProjectPipeline project={result.data.project} />
                <ProjectFile project={result.data.project} />
                <ProjectLink project={result.data.project} />
                <ProjectControl project={result.data.project} />
            </div>
        </div>
    );
}
