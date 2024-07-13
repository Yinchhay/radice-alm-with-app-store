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
import {
    UserSkillSet,
    UserProficiencies,
    UserProficienciesLevel,
    UserProficiencyKeys,
} from "@/drizzle/schema";
import { fetchUpdateProfileInformation } from "./fetch";
import TextareaField from "@/components/TextareaField";
import Tooltip from "@/components/Tooltip";
import { UserType } from "@/types/user";
import { useToast } from "@/components/Toaster";
import CheckList, { CheckBoxElement } from "@/components/CheckList";

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

    function addSkillSet() {
        const emptySkillSet: UserSkillSetWithId = {
            skill: "",
            proficiency: [UserProficienciesLevel.Know],
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

    function onChangeSkill(id: string, value: string) {
        setSkillSets((prev) => {
            if (!Array.isArray(prev) || prev.length < 0) {
                return [];
            }

            return prev.map((skillSet) => {
                if (skillSet.id === id) {
                    return {
                        ...skillSet,
                        skill: value,
                    } satisfies UserSkillSetWithId;
                }

                return skillSet;
            });
        });
    }

    function onSkillProficiencyChange(id: string, proficiencies: number[]) {
        setSkillSets((prev) => {
            if (!Array.isArray(prev) || prev.length < 0) {
                return [];
            }

            return prev.map((skillSet) => {
                if (skillSet.id === id) {
                    return {
                        ...skillSet,
                        proficiency: proficiencies,
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
                skill: skillSet.skill || "",
                proficiency: skillSet.proficiency || [
                    UserProficienciesLevel.Know,
                ],
                id: crypto.randomUUID(),
            };
        });
    }

    async function onSubmit(formData: FormData) {
        const skillSetsWithoutId: UserSkillSet[] = skillSets.map((skillSet) => {
            return {
                skill: skillSet.skill,
                proficiency: skillSet.proficiency,
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
                                    className="aspect-square object-cover rounded-full hover:cursor-pointer border border-gray-300"
                                    src={fileToUrl(
                                        user.profileUrl,
                                        user.type === UserType.PARTNER
                                            ? "/placeholders/logo_placeholder.png"
                                            : "/placeholders/placeholder.png",
                                    )}
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
                                <div className="flex flex-col items-start gap-2">
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
                                <div className="flex flex-col items-start gap-2">
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
                                <div className="flex flex-col items-start gap-2">
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
                                            <h2 className="text-lg min-w-fit">
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
                                                                Skill
                                                            </ColumName>
                                                            <ColumName className="min-w-36">
                                                                Proficiency
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
                                                                            onRemove={
                                                                                removeSkillSet
                                                                            }
                                                                            onSkillChange={
                                                                                onChangeSkill
                                                                            }
                                                                            onSkillProficiencyChange={
                                                                                onSkillProficiencyChange
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
    onRemove,
    onSkillChange,
    onSkillProficiencyChange,
}: {
    skillSet: UserSkillSetWithId;
    onRemove: (skillSetId: string) => void;
    onSkillChange: (id: string, value: string) => void;
    onSkillProficiencyChange: (id: string, proficiencies: number[]) => void;
}) {
    const skillSetsCheckList: CheckBoxElement[] = UserProficiencyKeys.map(
        (key) => {
            const value =
                UserProficienciesLevel[
                    key as keyof typeof UserProficienciesLevel
                ];

            return {
                name: key,
                value: value.toString(),
                // if the skillSet.proficiency has the value, then it is checked
                checked: skillSet.proficiency.some((p) => p === value),
            };
        },
    );

    return (
        <TableRow>
            <Cell>
                <InputField
                    defaultValue={skillSet.skill}
                    onChange={(e) => onSkillChange(skillSet.id, e.target.value)}
                />
            </Cell>
            <Cell>
                <CheckList
                    id={skillSet.id}
                    title=""
                    checkList={skillSetsCheckList}
                    onChange={(updatedList) => {
                        onSkillProficiencyChange(
                            skillSet.id,
                            updatedList
                                .filter((item) => item.checked)
                                .map((item) => parseInt(item.value)),
                        );
                    }}
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
            {formStatus.pending ? "Saving" : "Save"}
        </Button>
    );
}
