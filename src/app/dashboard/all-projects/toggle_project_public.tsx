"use client"
import { FetchProjectsForManageAllProjectsData } from "@/app/api/internal/project/route";
import ToggleSwitch from "@/components/ToggleSwitch";
import Tooltip from "@/components/Tooltip";
import { SuccessResponse } from "@/lib/response";
import { usePathname } from "next/navigation";
import { fetchUpdateProjectPublicStatus } from "../projects/[project_id]/settings/fetch";

export default function ToggleProjectPublic({
    project,
}: {
    project: SuccessResponse<FetchProjectsForManageAllProjectsData>["data"]["projects"][number];
}) {
    const pathname = usePathname();

    return (
        <Tooltip title="Toggle project public state" position="top">
            <ToggleSwitch
                defaultState={Boolean(project.isPublic)}
                onChange={async (state: boolean) => {
                    await fetchUpdateProjectPublicStatus(
                        project.id,
                        {
                            status: state,
                        },
                        pathname,
                    );
                }}
            />
        </Tooltip>
    );
}
