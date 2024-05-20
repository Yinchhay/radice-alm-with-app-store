import { getAuthUser } from "@/auth/lucia";
import { fetchOneAssociatedProject } from "../builder/fetch";
import ProjectDetail from "./project_detail";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import { revalidateTags } from "@/lib/server_utils";
import { OneAssociatedProject_C_Tag } from "@/repositories/project";
import ProjectMember from "./project_member";
import ProjectPartner from "./project_partner";
import { ProjectPipeline } from "./project_pipeline";
import ProjectFile from "./project_file";
import ProjectLink from "./project_link";
import { ProjectControl } from "./project_control";

type Params = {
    project_id: string;
};

export default async function ProjectSettings({ params }: { params: Params }) {
    // await revalidateTags<OneAssociatedProject_C_Tag>("OneAssociatedProject_C_Tag");
    const user = await getAuthUser();
    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    const result = await fetchOneAssociatedProject(params.project_id);
    if (!result.success) {
        throw new Error(result.message);
    }

    if (!result.data.project) {
        throw new Error("Project does not exist");
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
        throw new Error("Unauthorized to access project");
    }

    const originalProjectCategories = result.data.project.projectCategories.map(
        (projectCategory) => projectCategory.category,
    );

    return (
        <div className="w-full max-w-[700px] mx-auto bg-transparent z-10 relative">
            <h1 className="text-3xl font-medium mb-4">Project Settings</h1>
            <div className="grid gap-4">
                <ProjectDetail
                    project={result.data.project}
                    categories={
                        result.data.allCategories.length > 0
                            ? result.data.allCategories
                            : []
                    }
                    originalProjectCategories={originalProjectCategories}
                />
                <ProjectMember project={result.data.project} />
                <ProjectPartner project={result.data.project} />
                <ProjectPipeline project={result.data.project} />
                <ProjectFile project={result.data.project} />
                <ProjectLink project={result.data.project} />
                <ProjectControl project={result.data.project} />
            </div>
        </div>
    );
}
