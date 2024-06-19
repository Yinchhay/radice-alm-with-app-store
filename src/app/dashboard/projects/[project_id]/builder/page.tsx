import Link from "next/link";
import Builder from "./builder";
import Button from "@/components/Button";
import { IconEye, IconSettings } from "@tabler/icons-react";
import { getAuthUser } from "@/auth/lucia";
import { redirect } from "next/navigation";
import { fetchOneAssociatedProject } from "./fetch";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import Tooltip from "@/components/Tooltip";

type Params = {
    project_id: string;
};
export const dynamic = "force-dynamic";
export default async function ProjectBuilderPage({
    params,
}: {
    params: Params;
}) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    const fetchProject = await fetchOneAssociatedProject(params.project_id);
    if (!fetchProject.success) {
        redirect("/");
    }
    if (!fetchProject.data.project) {
        redirect("/");
    }
    const project = fetchProject.data.project;
    const { canEdit, projectRole } = checkProjectRole(
        user.id,
        project,
        user.type,
    );

    if (projectRole === ProjectRole.NONE) {
        redirect("/");
    }
    if (!canEdit) {
        redirect("/");
    }
    return (
        <div>
            {canEdit && (
                <div className="fixed bottom-8 right-8 z-[60] grid gap-2">
                    {projectRole == ProjectRole.OWNER && (
                        <Tooltip title="Settings" position="left">
                            <Link
                                href={`/dashboard/projects/${params.project_id}/settings`}
                            >
                                <Button square>
                                    <IconSettings size={32} stroke={1.5} />
                                </Button>
                            </Link>
                        </Tooltip>
                    )}
                    <Tooltip title="Preview" position="left">
                        <Link href={`/dashboard/projects/${params.project_id}`}>
                            <Button square>
                                <IconEye size={32} stroke={1.5} />
                            </Button>
                        </Link>
                    </Tooltip>
                </div>
            )}
            <Builder project={project} />
        </div>
    );
}
