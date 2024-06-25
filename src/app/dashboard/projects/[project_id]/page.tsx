import { getOneAssociatedProjectData } from "./fetch";

import Link from "next/link";

import Button from "@/components/Button";
import { IconHammer, IconSettings } from "@tabler/icons-react";
import { getAuthUser } from "@/auth/lucia";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { redirect } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import PreviewProject from "./_components/PreviewProject";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preview Project - Dashboard - Radice",
};

export default async function PreviewProjectPage({
    params,
}: {
    params: { project_id: string };
}) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    const fetchProject = await getOneAssociatedProjectData(
        Number(params.project_id),
    );
    //console.log(fetchProject);
    if (!fetchProject.success) {
        return;
    }

    if (JSON.stringify(fetchProject.data) === "{}") {
        //console.log("no info");
        return;
    }
    if (!fetchProject.data.project) {
        return;
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
    return (
        <div className="dark:text-white">
            {canEdit && (
                <div className="fixed bottom-8 right-8 z-30 grid gap-2">
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
            <PreviewProject project_id={Number(params.project_id)} />
        </div>
    );
}
