"use client";

import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Selector from "@/components/Selector";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
    fetchCategoriesBySearch,
    fetchEditProjectSettingsDetail,
} from "./fetch";
import { categories as categoriesSchema } from "@/drizzle/schema";
import { ACCEPTED_IMAGE_TYPES, fileToUrl } from "@/lib/file";
import { usePathname } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import ChipsHolder from "@/components/ChipsHolder";
import Chip from "@/components/Chip";
import TextareaField from "@/components/TextareaField";
import Tooltip from "@/components/Tooltip";
import { useSelector } from "@/hooks/useSelector";
import { localDebug } from "@/lib/utils";

export default function ProjectDetail({
    project,
    originalProjectCategories,
}: {
    project: FetchOneAssociatedProjectData["project"];
    originalProjectCategories: (typeof categoriesSchema.$inferSelect)[];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    const pathname = usePathname();
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditProjectSettingsDetail>>>();

    const [logoSrc, setLogoSrc] = useState<string>(fileToUrl(project.logoUrl));
    const fileInputRef = useRef<HTMLInputElement>(null);
    const projectName = useRef<HTMLInputElement>(null);
    const projectDescription = useRef<HTMLTextAreaElement>(null);

    const initialFormState = {
        logoUrl: project.logoUrl,
        name: project.name,
        description: project.description,
        categories: originalProjectCategories,
    };

    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const handleFormChange = () => {
            const currentFormState = {
                logoUrl: logoSrc,
                name: projectName.current?.value ?? project.name,
                description: projectDescription.current?.value ?? "",
                categories: checkedCategories.map((cate) => cate.id),
            };
            setIsChanged(
                JSON.stringify(initialFormState) !==
                    JSON.stringify(currentFormState),
            );
        };

        const formElements = [
            fileInputRef.current,
            projectName.current,
            projectDescription.current,
        ];
        formElements.forEach((el) =>
            el?.addEventListener("change", handleFormChange),
        );

        return () => {
            formElements.forEach((el) =>
                el?.removeEventListener("change", handleFormChange),
            );
        };
    }, [logoSrc, checkedCategories]);

    async function fetchCategoriesBySearchCallback(search: string) {
        try {
            const response = await fetchCategoriesBySearch(search, 10);
            if (response.success) {
                return response.data.categories;
            }
        } catch (error) {
            localDebug(
                "Error fetching categories by search",
                "project_detail.tsx",
            );
        }

        return [];
    }

    const {
        showSelectorOverlay,
        itemsCheckList,
        checkedItems: checkedCategories,
        searchTerm,
        onSearchChange,
        onOpenSelector,
        onCheckChange,
        onCloseSelector,
        onReset,
        onConfirm,
    } = useSelector(
        fetchCategoriesBySearchCallback,
        originalProjectCategories,
        "name",
        "id",
    );

    function onResetClick() {
        if (!project) return;

        setLogoSrc(fileToUrl(project.logoUrl));
        if (projectName.current) {
            projectName.current.value = project.name;
        }
        if (projectDescription.current) {
            projectDescription.current.value = project.description ?? "";
        }
        onReset();
        setResult(undefined);
        setIsChanged(false);
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
                        pathname,
                        formData,
                    );
                    setResult(result);
                    setIsChanged(false);
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
                        <ImageWithFallback
                            className="aspect-square object-cover rounded-sm hover:cursor-pointer"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                }
                            }}
                            src={logoSrc}
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
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
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
                        <TextareaField
                            className="h-36"
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
                            <ChipsHolder className="mt-1  mr-2">
                                {Array.isArray(checkedCategories) &&
                                    checkedCategories.map((cate) => {
                                        // TODO: add tooltip
                                        return (
                                            cate.checked && (
                                                <Chip key={cate.name}>
                                                    {cate.name}
                                                </Chip>
                                            )
                                        );
                                    })}
                            </ChipsHolder>
                            <Tooltip title={"Add categories"}>
                                <Button
                                    onClick={onOpenSelector}
                                    square={true}
                                    variant="primary"
                                    type="button"
                                >
                                    <IconPlus></IconPlus>
                                </Button>
                            </Tooltip>
                        </div>
                        {showSelectorOverlay && (
                            <Selector
                                className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto"
                                selectorTitle="Add categories to project"
                                searchPlaceholder="Search categories"
                                checkListTitle="Categories"
                                checkList={itemsCheckList || []}
                                onSearchChange={onSearchChange}
                                onCancel={onCloseSelector}
                                onConfirm={onConfirm}
                                onCheckChange={onCheckChange}
                                searchTerm={searchTerm}
                            />
                        )}
                    </div>
                </div>
                {isChanged && (
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
                )}
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
