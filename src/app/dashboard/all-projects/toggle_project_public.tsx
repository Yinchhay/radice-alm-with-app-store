"use client"
import { FetchProjectsForManageAllProjectsData } from "@/app/api/internal/project/route";
import ToggleSwitch from "@/components/ToggleSwitch";
import Tooltip from "@/components/Tooltip";
import { SuccessResponse } from "@/lib/response";
import { usePathname } from "next/navigation";
import { fetchUpdateProjectPublicStatus } from "../projects/[project_id]/settings/fetch";
import { useToast } from "@/components/Toaster";
import { IconCheck } from "@tabler/icons-react";

export default function ToggleProjectPublic({
    project,
}: {
    project: SuccessResponse<FetchProjectsForManageAllProjectsData>["data"]["projects"][number];
}) {
    const pathname = usePathname();
    const { addToast } = useToast();

    return (
        <ToggleSwitch
            defaultState={Boolean(project.isPublic)}
            yesLabel="Live"
            noLabel="Off"
            onChange={async (state: boolean) => {
                const res = await fetchUpdateProjectPublicStatus(
                    project.id,
                    {
                        status: state,
                    },
                    pathname,
                );

                if (res.success) {
                    addToast(
                        <div className="flex gap-2">
                            <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                            <p>Successfully updated project public status</p>
                        </div>,
                    );
                }
            }}
        />
    );
}
