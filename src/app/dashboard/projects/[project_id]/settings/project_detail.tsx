"use client";

import {
    FetchOneAssociatedProjectData,
} from "@/app/api/internal/project/[project_id]/route";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Selector from "@/components/Selector";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchEditProjectSettingsDetail } from "./fetch";
import { categories as categoriesSchema } from "@/drizzle/schema";
import { fileToUrl } from "@/lib/file";
import { useSelector } from "@/app/hooks/useSelector";

export default function ProjectDetail({
    project,
    categories,
    originalProjectCategories,
}: {
    project: FetchOneAssociatedProjectData["project"];
    categories: (typeof categoriesSchema.$inferSelect)[];
    originalProjectCategories: (typeof categoriesSchema.$inferSelect)[];
}) {
    if (!project) {
        throw new Error("Project not found");
    }
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditProjectSettingsDetail>>>();

    // Variables for resetting the form
    const [logoSrc, setLogoSrc] = useState<string>(
        `/api/file?filename=${project?.logoUrl}` ?? "/placeholder.webp",
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const projectName = useRef<HTMLInputElement>(null);
    const projectDescription = useRef<HTMLInputElement>(null);

    const {
        showSelectorOverlay,
        openSelector,
        onSearchChange,
        onCheckChange,
        onCancel,
        onConfirm,
        onReset: onResetCategories,
        itemsCheckListDisplay,
        checkedItems: checkedCategories,
    } = useSelector(categories, originalProjectCategories, "name", "id");

    function onResetClick() {
        if (!project) return;

        setLogoSrc(
            `/api/file?filename=${project?.logoUrl}` ?? "/placeholder.webp",
        );

        if (projectName.current) {
            projectName.current.value = project.name;
        }
        if (projectDescription.current) {
            projectDescription.current.value = project.description ?? "";
        }
        onResetCategories();
    }

    return (
        <Card>
            <form
                action={async (formData: FormData) => {
                    const result = await fetchEditProjectSettingsDetail(
                        project.id,
                        {
                            projectName:
                                projectName.current?.value ?? project.name,
                            projectDescription:
                                projectDescription.current?.value || "",
                            projectCategories: checkedCategories
                                .filter((cate) => cate.checked)
                                .map((cate) => Number(cate.value)),
                            logoUrl: "",
                        },
                        fileInputRef.current?.files?.[0],
                    );
                    setResult(result);
                }}
                className="grid gap-4"
            >
                <div className="grid grid-cols-5">
                    <label
                        htmlFor="projectLogo"
                        className="font-normal col-span-2"
                    >
                        Project Logo:
                    </label>
                    <div className="col-span-3">
                        <Image
                            className="aspect-square object-cover rounded-sm hover:cursor-pointer"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                }
                            }}
                            src={
                                fileToUrl(project.logoUrl) ||
                                "/placeholder.webp"
                            }
                            alt={"project logo"}
                            width={128}
                            height={128}
                        />
                        <InputField
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setLogoSrc(URL.createObjectURL(file));
                                }
                            }}
                            hidden
                            type="file"
                            name="projectLogo"
                            id="projectLogo"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-5">
                    <label
                        htmlFor="projectName"
                        className="font-normal col-span-2"
                    >
                        Project Name:
                    </label>
                    <div className="col-span-3">
                        <InputField
                            ref={projectName}
                            defaultValue={project?.name ?? ""}
                            name="projectName"
                            id="projectName"
                            placeholder="Project name"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-5">
                    <label
                        htmlFor="projectDescription"
                        className="font-normal col-span-2"
                    >
                        Project Description:
                    </label>
                    <div className="col-span-3">
                        <InputField
                            ref={projectDescription}
                            defaultValue={project?.description ?? ""}
                            name="projectDescription"
                            id="projectDescription"
                            placeholder="Project description"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-5">
                    <label
                        htmlFor="projectCategories"
                        className="font-normal col-span-2"
                    >
                        Project Categories:
                    </label>
                    <div className="col-span-3">
                        <div className="flex items-center">
                            {checkedCategories.map(
                                (cate) =>
                                    // only show checked categories
                                    cate.checked && (
                                        <div
                                            key={cate.value}
                                            className="bg-gray-200 rounded-full px-2 py-1 text-sm mr-2"
                                        >
                                            {cate.name}
                                        </div>
                                    ),
                            )}
                            <Button
                                onClick={openSelector}
                                square={true}
                                variant="primary"
                                type="button"
                            >
                                <IconPlus></IconPlus>
                            </Button>
                        </div>
                        {showSelectorOverlay && (
                            <Selector
                                className="w-[420px]"
                                selectorTitle="Add categories to project"
                                searchPlaceholder="Search categories"
                                checkListTitle="Categories"
                                checkList={itemsCheckListDisplay || []}
                                onSearchChange={onSearchChange}
                                onCheckChange={onCheckChange}
                                onCancel={onCancel}
                                onConfirm={onConfirm}
                            />
                        )}
                    </div>
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
