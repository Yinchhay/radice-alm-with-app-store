import { getAuthUser } from "@/auth/lucia";
import { fetchOneAssociatedProject } from "../builder/fetch";
import ProjectDetail from "./project_detail";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import { revalidateTags } from "@/lib/server_utils";
import { OneAssociatedProject_C_Tag } from "@/repositories/project";

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

    return (
        <div className="w-full max-w-[700px] mx-auto bg-transparent z-10 relative">
            <h1 className="text-3xl font-medium mb-4">Project Settings</h1>
            <ProjectDetail project={result.data.project}/>
        </div>
    );
}
