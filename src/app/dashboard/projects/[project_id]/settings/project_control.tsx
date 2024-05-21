"use client";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ToggleSwitch from "@/components/ToggleSwitch";
import { togglePublicStatus } from "./server";

export function ProjectControl({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project does not exist");
    }

    return (
        <Card>
            <h1 className="text-2xl">Project control</h1>
            <div className="my-4 flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-lg">Make project public</p>
                    <ToggleSwitch
                        defaultState={Boolean(project.isPublic)}
                        onChange={async (state: boolean) => {
                            await togglePublicStatus(project.id, state);
                        }}
                    />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <p className="text-lg">Transfer project</p>
                    <Button>Transfer</Button>
                </div>
            </div>
        </Card>
    );
}
