"use client";
import { SuccessResponse } from "@/lib/response";
import ToggleSwitch from "@/components/ToggleSwitch";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/Toaster";
import { IconCheck } from "@tabler/icons-react";
import { fetchUpdateAppPriority } from "./fetch";
import { FetchProjectsForManageAllProjectsData } from "@/app/api/internal/project/route";

export default function ToggleAppPriority({
    project,
}: {
    project: SuccessResponse<FetchProjectsForManageAllProjectsData>["data"]["projects"][number] & {
        apps?: { id: number; status: string | null; featuredPriority?: boolean | number | null }[];
    };
}) {
    const pathname = usePathname();
    const { addToast } = useToast();

    // Find the accepted app
    const acceptedApp = project.apps?.find(app => app.status === "accepted");
    if (!acceptedApp) return null;

    return (
        <ToggleSwitch
            defaultState={!!acceptedApp.featuredPriority}
            yesLabel="Priority"
            noLabel="Normal"
            onChange={async (state: boolean) => {
                const res = await fetchUpdateAppPriority(
                    project.id, // Use project.id for the PATCH
                    state,
                    pathname,
                );
                if (res.success) {
                    addToast(
                        <div className="flex gap-2">
                            <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                            <p>Successfully updated app priority</p>
                        </div>,
                    );
                }
            }}
        />
    );
} 