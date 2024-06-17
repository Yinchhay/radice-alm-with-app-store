"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconCheck, IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { redirect, usePathname } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import { ACCEPTED_IMAGE_TYPES, fileToUrl } from "@/lib/file";
import { User } from "lucia";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import Table from "@/components/table/Table";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import Dropdown, { DropdownElement } from "@/components/Dropdown";
import { UserSkillSet, UserSkillSetLevel } from "@/drizzle/schema";
import { arrayToDropdownList } from "@/lib/array_to_dropdown_list";
import { fetchUpdateProfileInformation } from "./fetch";
import TextareaField from "@/components/TextareaField";
import Tooltip from "@/components/Tooltip";
import { UserType } from "@/types/user";
import { useToast } from "@/components/Toaster";

type UserSkillSetWithId = UserSkillSet & { id: string };

export function EditProfileOverlay({ user }: { user: User }) {
    if (!user) {
        return redirect("/login");
    }

    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchUpdateProfileInformation>>>();
    const [skillSets, setSkillSets] = useState<UserSkillSetWithId[]>(
        addIdToSkillSet(user.skillSet),
    );
    const [logoSrc, setLogoSrc] = useState<string>(fileToUrl(user.profileUrl));
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    // convert enum to 2d array, but take only its key and value
    const skillSetValues = Object.entries(UserSkillSetLevel).filter(
        ([, value]) => typeof value === "number",
    );
    const skillSetsDropDownList: DropdownElement[] = skillSetValues.map(
        ([name, value]) => {
            return {
                name: name as string,
                value: value.toString(),
            };
        },
    );

    function addSkillSet() {
        const emptySkillSet: UserSkillSetWithId = {
            label: "",
            level: UserSkillSetLevel.Know,
            id: crypto.randomUUID(),
        };

        setSkillSets((prev) => {
            if (!Array.isArray(prev) || prev.length < 0) {
                return [emptySkillSet];
            }

            return [...prev, emptySkillSet];
        });
    }

    function removeSkillSet(id: string) {
        setSkillSets((prev) => {
            if (!Array.isArray(prev) || prev.length < 0) {
                return [];
            }

            return prev.filter((skillSet) => skillSet.id !== id);
        });
    }

    function onChangeSkillSetLabel(id: string, value: string) {
        setSkillSets((prev) => {
            if (!Array.isArray(prev) || prev.length < 0) {
                return [];
            }

            return prev.map((skillSet) => {
                if (skillSet.id === id) {
                    return {
                        ...skillSet,
                        label: value,
                    };
                }

                return skillSet;
            });
        });
    }

    function onChangeSkillSetLevel(id: string, value: number) {
        setSkillSets((prev) => {
            if (!Array.isArray(prev) || prev.length < 0) {
                return [];
            }

            return prev.map((skillSet) => {
                if (skillSet.id === id) {
                    return {
                        ...skillSet,
                        level: value as unknown as UserSkillSetLevel,
                    };
                }

                return skillSet;
            });
        });
    }

    // Add id to identify each skill sets so that we can use it as key in loop later
    function addIdToSkillSet(
        skillSetsToAddId: UserSkillSet[] | null,
    ): UserSkillSetWithId[] {
        if (!Array.isArray(skillSetsToAddId) || skillSetsToAddId.length < 0) {
            return [];
        }

        // think of consequence when a user want to exploit by calling api and try to input json other format than what we expect.
        return skillSetsToAddId.map((skillSet) => {
            return {
                label: skillSet.label || "",
                level: skillSet.level || UserSkillSetLevel.Know,
                id: crypto.randomUUID(),
            };
        });
    }

    async function onSubmit(formData: FormData) {
        const skillSetsWithoutId: UserSkillSet[] = skillSets.map((skillSet) => {
            return {
                label: skillSet.label,
                level: Number(skillSet.level),
            };
        });

        const res = await fetchUpdateProfileInformation(
            {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                skillSet: skillSetsWithoutId,
                description: formData.get("description") as string,
                currentProfileLogo: user.profileUrl ?? "",
            },
            formData,
            pathname,
        );
        setResult(res);
    }

    function onCancel() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setLogoSrc(fileToUrl(user.profileUrl));
        setSkillSets(addIdToSkillSet(user.skillSet));
        setResult(undefined);
        setShowOverlay(false);
    }

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && result?.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                    <p>Successfully updated profile information</p>
                </div>,
            );

            onCancel();
        }
    }, [result]);

    return (
        <>
            <Tooltip title="Edit profile">
                <Button onClick={() => setShowOverlay(true)} square={true}>
                    <IconEdit></IconEdit>
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto">
                        <form action={onSubmit} className="flex flex-col gap-4">
                            <div>
                                <ImageWithFallback
                                    className="aspect-square object-cover rounded-full hover:cursor-pointer"
                                    src={logoSrc}
                                    alt={"profile"}
                                    width={128}
                                    height={128}
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click();
                                        }
                                    }}
                                />
                                <InputField
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setLogoSrc(
                                                URL.createObjectURL(file),
                                            );
                                        }
                                    }}
                                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                    hidden
                                    type="file"
                                    name="profileLogo"
                                    id="profileLogo"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col items-start">
                                    <label
                                        htmlFor="firstName"
                                        className="font-normal"
                                    >
                                        First name
                                    </label>
                                    <InputField
                                        name="firstName"
                                        id="firstName"
                                        defaultValue={user.firstName ?? ""}
                                    />
                                </div>
                                <div className="flex flex-col items-start">
                                    <label
                                        htmlFor="lastName"
                                        className="font-normal"
                                    >
                                        Last name
                                    </label>
                                    <InputField
                                        name="lastName"
                                        id="lastName"
                                        defaultValue={user.lastName ?? ""}
                                    />
                                </div>
                                <div className="flex flex-col items-start">
                                    <label
                                        htmlFor="description"
                                        className="font-normal"
                                    >
                                        Description
                                    </label>
                                    <TextareaField
                                        className="h-36"
                                        name="description"
                                        id="description"
                                        defaultValue={user.description ?? ""}
                                    />
                                </div>
                                {user.type === UserType.USER && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center w-full">
                                            <h2 className="text-lg font-semibold min-w-fit">
                                                Skill sets:
                                            </h2>
                                            <Button
                                                type="button"
                                                square={true}
                                                variant="primary"
                                                onClick={addSkillSet}
                                            >
                                                <IconPlus></IconPlus>
                                            </Button>
                                        </div>
                                        <div>
                                            {Array.isArray(skillSets) &&
                                                skillSets.length > 0 && (
                                                    <Table className="w-full">
                                                        <TableHeader>
                                                            <ColumName>
                                                                Label
                                                            </ColumName>
                                                            <ColumName className="min-w-36">
                                                                Level
                                                            </ColumName>
                                                            <ColumName>
                                                                Action
                                                            </ColumName>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {skillSets.map(
                                                                (skillSet) => {
                                                                    return (
                                                                        <SkillSetRow
                                                                            key={
                                                                                skillSet.id
                                                                            }
                                                                            skillSet={
                                                                                skillSet
                                                                            }
                                                                            dropDownList={
                                                                                skillSetsDropDownList
                                                                            }
                                                                            onRemove={
                                                                                removeSkillSet
                                                                            }
                                                                            onLabelChange={
                                                                                onChangeSkillSetLabel
                                                                            }
                                                                            onLevelChange={
                                                                                onChangeSkillSetLevel
                                                                            }
                                                                        />
                                                                    );
                                                                },
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!result?.success && result?.errors && (
                                <FormErrorMessages errors={result?.errors} />
                            )}
                            <div className="flex justify-end gap-2 my-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <EditProfileBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function SkillSetRow({
    skillSet,
    dropDownList,
    onRemove,
    onLabelChange,
    onLevelChange,
}: {
    skillSet: UserSkillSetWithId;
    dropDownList: DropdownElement[];
    onRemove: (skillSetId: string) => void;
    onLabelChange: (id: string, value: string) => void;
    onLevelChange: (id: string, value: number) => void;
}) {
    return (
        <TableRow>
            <Cell>
                <InputField
                    defaultValue={skillSet.label}
                    onChange={(e) => onLabelChange(skillSet.id, e.target.value)}
                />
            </Cell>
            <Cell>
                <Dropdown
                    defaultSelectedElement={{
                        name:
                            dropDownList.find(
                                (item) =>
                                    item.value === skillSet.level.toString(),
                            )?.name ?? dropDownList[0].name,
                        value: skillSet.level.toString(),
                    }}
                    dropdownList={dropDownList}
                    onChange={(selectedElement) =>
                        onLevelChange(
                            skillSet.id,
                            Number(selectedElement.value),
                        )
                    }
                />
            </Cell>
            <Cell>
                <Button
                    type="button"
                    onClick={() => onRemove(skillSet.id)}
                    square={true}
                    variant="danger"
                >
                    <IconX></IconX>
                </Button>
            </Cell>
        </TableRow>
    );
}

function EditProfileBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Editing" : "Edit"}
        </Button>
    );
}
