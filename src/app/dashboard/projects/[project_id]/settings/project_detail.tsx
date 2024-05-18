"use client";

import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import { fetchCategories } from "@/app/dashboard/categories/fetch";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { CheckBoxElement } from "@/components/CheckList";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Selector from "@/components/Selector";
import { arrayToCheckList } from "@/lib/array_to_check_list";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchEditProjectSettingsDetail } from "./fetch";

export default function ProjectDetail({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
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

    // To store checkboxes for project categories so that when user resets the form, the checkboxes will be reset to the original state of the project
    const [projectCateCheckLists, setProjectCateCheckLists] = useState<
        CheckBoxElement[]
    >([]);
    const [showSelectorOverlay, setShowSelectorOverlay] =
        useState<boolean>(false);

    // Variable for storing fetched categories
    const [categoriesCheckLists, setCategoriesCheckLists] = useState<
        CheckBoxElement[]
    >([]);

    // For keeping track of checked categories
    const [checkedCategories, setCheckedCategories] = useState<
        CheckBoxElement[]
    >([]);

    // For keeping track of checked categories before user opens the category selector
    // in case user cancels the selection, the checked categories will be reset to this
    const [checkedCategoriesBeforeEdit, setCheckedCategoriesBeforeEdit] =
        useState<CheckBoxElement[]>([]);

    async function openCategorySelector() {
        setShowSelectorOverlay(true);

        setCheckedCategoriesBeforeEdit(checkedCategories);
        await getCategories("");
    }

    function getCheckedList(lists: CheckBoxElement[]) {
        return lists.filter((cate) => cate.checked);
    }

    async function getCategories(searchText: string) {
        const response = await fetchCategories(1, 100, searchText);
        if (response.success) {
            const newCheckList = arrayToCheckList(
                response.data.categories,
                "name",
                "id",
            );
            const projectCategories = project?.projectCategories ?? [];

            const updatedCheckList = newCheckList.map((checkListCate) => {
                // check if the category is already in the project, if no, check if it is in the checked categories
                const isChecked =
                    projectCategories.some(
                        (cate) =>
                            cate.categoryId === Number(checkListCate.value),
                    ) ||
                    checkedCategories.some(
                        (cate) => cate.value === checkListCate.value,
                    );

                return {
                    ...checkListCate,
                    checked: isChecked,
                };
            });

            const updatedCheckedCategories = getCheckedList(updatedCheckList);

            if (projectCateCheckLists.length === 0) {
                setProjectCateCheckLists(updatedCheckedCategories);
            }

            if (checkedCategoriesBeforeEdit.length === 0) {
                setCheckedCategoriesBeforeEdit(updatedCheckedCategories);
            }

            setCheckedCategories(updatedCheckedCategories);
            setCategoriesCheckLists(updatedCheckList);
        }
    }

    function closeCategorySelector() {
        setShowSelectorOverlay(false);
    }

    function onResetClick() {
        if (!project) return;

        setLogoSrc(`/api/file?filename=${project?.logoUrl}` ?? "/placeholder.webp");

        setCheckedCategories(projectCateCheckLists);
        setCategoriesCheckLists([]);
        if (projectName.current) {
            projectName.current.value = project.name;
        }
        if (projectDescription.current) {
            projectDescription.current.value = project.description ?? "";
        }
    }

    useEffect(() => {
        getCategories("");
    }, []);

    return (
        <Card>
            <form
                action={async (formData: FormData) => {
                    const result = await fetchEditProjectSettingsDetail(
                        {
                            projectId: project.id.toString(),
                            projectName:
                                projectName.current?.value ?? project.name,
                            projectDescription:
                                projectDescription.current?.value || "",
                            projectCategories: checkedCategories.map((cate) =>
                                Number(cate.value),
                            ),
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
                            {checkedCategories.map((cate) => (
                                <span
                                    key={cate.value}
                                    className="inline-block px-2 py-1 text-sm bg-gray-100 rounded-full mr-2 mb-2"
                                >
                                    {cate.name}
                                </span>
                            ))}
                            <Button
                                square
                                variant="outline"
                                className="outline-0"
                                onClick={openCategorySelector}
                                type="button"
                            >
                                <IconPlus
                                    size={28}
                                    className="group-hover:text-blue-500 transition-all"
                                    stroke={1.3}
                                />
                            </Button>
                        </div>
                        {showSelectorOverlay && (
                            <Selector
                                className="w-[420px]"
                                selectorTitle="Add categories to project"
                                searchPlaceholder="Search categories"
                                checkListTitle="Categories"
                                checkList={categoriesCheckLists || []}
                                onSearchChange={async (searchText) => {
                                    await getCategories(searchText);
                                }}
                                onCheckChange={(updatedList) => {
                                    setCheckedCategories(
                                        getCheckedList(updatedList),
                                    );
                                }}
                                onCancel={() => {
                                    setCheckedCategories(
                                        checkedCategoriesBeforeEdit,
                                    );
                                    closeCategorySelector();
                                }}
                                onConfirm={() => {
                                    closeCategorySelector();
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="flex gap-4">
                        <ResetBtn onClick={onResetClick} />
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

function ResetBtn({ onClick }: { onClick?: () => void }) {
    const formStatus = useFormStatus();
    return (
        <Button
            onClick={onClick}
            disabled={formStatus.pending}
            variant="secondary"
            type="button"
        >
            {formStatus.pending ? "Resetting" : "Reset"}
        </Button>
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
