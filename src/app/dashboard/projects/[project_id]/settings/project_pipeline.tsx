"use client";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CheckList, { CheckBoxElement } from "@/components/CheckList";
import FormErrorMessages from "@/components/FormErrorMessages";
import { ProjectPipelineStatus } from "@/drizzle/schema";
import { arrayToCheckList } from "@/lib/array_to_check_list";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchEditProjectSettingsPipeline } from "./fetch";
import { usePathname } from "next/navigation";

/**
 * Any change to the pipeline type please change in 
 * projectPipeLineStatusType in src\app\api\internal\project\[project_id]\schema.ts
 */
export function ProjectPipeline({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    function getPipelineStatus(): ProjectPipelineStatus {
        if (project && project.pipelineStatus) {
            return {
                requirements: project.pipelineStatus?.requirements ?? false,
                definition: project.pipelineStatus?.definition ?? false,
                analysis: project.pipelineStatus?.analysis ?? false,
                approved: project.pipelineStatus?.approved ?? false,
                chartered: project.pipelineStatus?.chartered ?? false,
                design: project.pipelineStatus?.design ?? false,
                development: project.pipelineStatus?.development ?? false,
                build: project.pipelineStatus?.build ?? false,
                test: project.pipelineStatus?.test ?? false,
                release: project.pipelineStatus?.release ?? false,
                live: project.pipelineStatus?.live ?? false,
                retired: project.pipelineStatus?.retired ?? false,
                retiring: project.pipelineStatus?.retiring ?? false,
            };
        }

        return {
            requirements: false,
            definition: false,
            analysis: false,
            approved: false,
            chartered: false,
            design: false,
            development: false,
            build: false,
            test: false,
            release: false,
            live: false,
            retired: false,
            retiring: false,
        };
    }

    function pipeLineToCheckList(): CheckBoxElement[] {
        const pipelineStatus = getPipelineStatus();
        const checkList = arrayToCheckList(
            Object.entries(pipelineStatus),
            0,
            1,
        );

        return checkList.map((checkbox) => {
            return {
                name: checkbox.name,
                value: checkbox.value,
                checked: Boolean(checkbox.value),
            };
        });
    }

    const [pipelineStatusCheckList, setPipelineStatusCheckList] = useState<
        CheckBoxElement[]
    >(pipeLineToCheckList());
    const pathname = usePathname();
    const [result, setResult] =
        useState<
            Awaited<ReturnType<typeof fetchEditProjectSettingsPipeline>>
        >();

    function onResetClick() {
        setPipelineStatusCheckList(pipeLineToCheckList());
    }

    function checkListToObject(
        checkList: CheckBoxElement[],
    ): Record<string, boolean> {
        let object: Record<string, boolean> = {};
        for (const checkBox of checkList) {
            object[checkBox.name] = checkBox.checked;
        }

        return object;
    }

    async function onSubmit(formData: FormData) {
        if (!project) return;

        const projectPipelineStatus = checkListToObject(
            pipelineStatusCheckList,
        ) as ProjectPipelineStatus;

        const response = await fetchEditProjectSettingsPipeline(
            project.id,
            projectPipelineStatus,
            pathname,
        );
        setResult(response);
    }

    return (
        <Card>
            <h1 className="text-2xl">Project pipeline</h1>
            <form action={onSubmit}>
                <div className="my-4">
                    <CheckList
                        title={"Status"}
                        checkList={pipelineStatusCheckList}
                    />
                </div>
                <div className="flex justify-end">
                    <div className="flex gap-4">
                        <Button
                            onClick={onResetClick}
                            variant="secondary"
                            type="button"
                        >
                            Reset
                        </Button>
                        <SaveChangesBtn />
                    </div>
                </div>
                {!result?.success && result?.errors && (
                    <FormErrorMessages errors={result?.errors} />
                )}
            </form>
        </Card>
    );
}

function SaveChangesBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Saving changes" : "Save changes"}
        </Button>
    );
}
