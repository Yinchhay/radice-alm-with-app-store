"use client";

import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
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
import { FetchAllCategories } from "@/app/api/internal/category/all/route";
import { categories as categoriesSchema } from "@/drizzle/schema";

export default function ProjectDetail({
    project,
    categories,
    originalProjectCategories,
}: {
    project: FetchOneAssociatedProjectData["project"];
    categories: FetchAllCategories["categories"];
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

    const [showSelectorOverlay, setShowSelectorOverlay] = useState(false);

    // convert categories to check list for selector
    const categoriesCheckLists = arrayToCheckList(categories, "name", "id");
    const originalCategoriesInProject = arrayToCheckList(
        originalProjectCategories,
        "name",
        "id",
    ).map((cate) => ({ ...cate, checked: true }));

    // store previous checked categories before editing
    const [checkedCategoriesBeforeEdit, setCheckedCategoriesBeforeEdit] =
        useState<CheckBoxElement[]>([]);

    // store current checked categories
    const [checkedCategories, setCheckedCategories] = useState<
        CheckBoxElement[]
    >([]);

    /**
     * to store checklist display because when search, the list will get filtered
     */
    const [categoriesCheckListsDisplay, setCategoriesCheckListsDisplay] =
        useState<CheckBoxElement[]>([]);

    function closeCategorySelector() {
        setShowSelectorOverlay(false);
    }

    function openCategorySelector() {
        // structured clone because if remove, checkedCategories pass by its reference
        // causing cancel button to not work
        setCheckedCategoriesBeforeEdit(structuredClone(checkedCategories));
        setShowSelectorOverlay(true);
    }

    // entire list, find the new changed checkbox, update checked status
    function updateChecked(
        lists: CheckBoxElement[],
        changedCheckbox: CheckBoxElement,
        checked: boolean,
    ) {
        return lists.map((cate) => {
            if (cate.value === changedCheckbox.value) {
                return { ...cate, checked };
            }
            return cate;
        });
    }

    // listToUpdate will copy checked status from listToCheck, any unchecked will remain in listToUpdate
    function updateCheckedByTwoList(
        listToUpdated: CheckBoxElement[],
        listToCheck: CheckBoxElement[],
    ) {
        return listToUpdated.map((cate) => {
            const checked = listToCheck.find(
                (check) => check.value === cate.value,
            )?.checked;
            return { ...cate, checked: checked ?? false };
        });
    }

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

        const comparedList = updateCheckedByTwoList(
            categoriesCheckLists,
            originalCategoriesInProject,
        );
        setCheckedCategories(comparedList);
        setCategoriesCheckListsDisplay(comparedList);
    }

    useEffect(() => {
        const comparedList = updateCheckedByTwoList(
            categoriesCheckLists,
            originalCategoriesInProject,
        );
        setCheckedCategories(comparedList);
        setCategoriesCheckListsDisplay(comparedList);
    }, [categories]);

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
                                checkList={categoriesCheckListsDisplay || []}
                                onSearchChange={async (searchText) => {
                                    const filteredCategories =
                                        categoriesCheckLists.filter((cate) =>
                                            cate.name
                                                .toLowerCase()
                                                .includes(
                                                    searchText.toLowerCase(),
                                                ),
                                        );
                                    // since the list is filtered, we need to update the checked status
                                    setCategoriesCheckListsDisplay(
                                        updateCheckedByTwoList(
                                            filteredCategories,
                                            checkedCategories,
                                        ),
                                    );
                                }}
                                onCheckChange={(
                                    updatedList,
                                    changedCheckbox,
                                ) => {
                                    setCheckedCategories(
                                        updateChecked(
                                            checkedCategories,
                                            changedCheckbox,
                                            changedCheckbox.checked,
                                        ),
                                    );
                                }}
                                onCancel={() => {
                                    setCheckedCategories(
                                        checkedCategoriesBeforeEdit,
                                    );
                                    setCategoriesCheckListsDisplay(
                                        checkedCategoriesBeforeEdit,
                                    );
                                    closeCategorySelector();
                                }}
                                onConfirm={() => {
                                    setCategoriesCheckListsDisplay(
                                        checkedCategories,
                                    );
                                    closeCategorySelector();
                                }}
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
