"use client";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Cell from "@/components/table/Cell";
import ColumName from "@/components/table/ColumnName";
import Table from "@/components/table/Table";
import TableBody from "@/components/table/TableBody";
import TableHeader from "@/components/table/TableHeader";
import TableRow from "@/components/table/TableRow";
import ToggleSwitch from "@/components/ToggleSwitch";
import { users } from "@/drizzle/schema";
import { useFormStatus } from "react-dom";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import Selector from "@/components/Selector";
import InputField from "@/components/InputField";
import { useEffect, useRef, useState } from "react";
import { fetchEditProjectSettingsMembers, fetchUsersBySearch } from "./fetch";
import FormErrorMessages from "@/components/FormErrorMessages";
import { editMemberArray } from "@/app/api/internal/project/[project_id]/schema";
import { z } from "zod";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import { useSelector } from "@/hooks/useSelector";
import { localDebug } from "@/lib/utils";
import { useToast } from "@/components/Toaster";

export type UserWithoutPassword = Omit<typeof users.$inferSelect, "password">;

export type MemberList = {
    member: UserWithoutPassword;
    title: string;
    canEdit: boolean;
};

export default function ProjectMember({
    project,
    originalProjectMembers,
}: {
    project: FetchOneAssociatedProjectData["project"];
    originalProjectMembers: UserWithoutPassword[];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    const pathname = usePathname();

    async function fetchUsersBySearchCallback(search: string) {
        try {
            const response = await fetchUsersBySearch(search, 10);
            if (response.success) {
                return response.data.users as UserWithoutPassword[];
            }
        } catch (error) {
            localDebug("Error fetching users by search", "project_member.tsx");
        }

        return [];
    }

    const {
        showSelectorOverlay,
        itemsCheckList,
        checkedItems,
        checkedItemsValues: usersInTheSystem,
        searchTerm,
        onSearchChange,
        onCheckChange,
        onOpenSelector,
        onCloseSelector,
        onRemoveItem,
        onReset,
        onConfirm,
    } = useSelector(
        fetchUsersBySearchCallback,
        originalProjectMembers,
        "firstName",
        "id",
        "lastName",
    );

    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditProjectSettingsMembers>>>();
    const [membersList, setMembersList] = useState<MemberList[]>([]);

    const { addToast } = useToast();

    const [initialFormState, setInitialFormState] = useState<string>();
    const [isFormModified, setIsFormModified] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);

    // update the memberList to enforce switch to reset
    function onCanEditChange(id: string, canEdit: boolean) {
        const updatedMembersList = membersList.map((member) => {
            if (member.member.id === id) {
                return {
                    ...member,
                    canEdit,
                };
            }

            return member;
        });

        setMembersList([...updatedMembersList]);
    }

    function removeMemberById(id: string) {
        onRemoveItem(id);
    }

    const MemberLists = membersList.map((member) => (
        <Member
            key={member.member.id}
            member={member.member}
            title={member.title}
            canEdit={member.canEdit}
            onRemove={removeMemberById}
            onCanEditChange={onCanEditChange}
        />
    ));

    function constructMemberLists() {
        const memberLists: MemberList[] = [];

        checkedItems.forEach((checkedItem) => {
            const memberDetail = usersInTheSystem.find(
                (user) => user.id === checkedItem.value,
            );

            const memberAlreadyInProject = project?.projectMembers.find(
                (projectMember) => projectMember.user.id === checkedItem.value,
            );
            if (memberDetail) {
                memberLists.push({
                    member: memberDetail,
                    title: memberAlreadyInProject?.title || "",
                    canEdit: Boolean(memberAlreadyInProject?.canEdit),
                });
            }
        });

        return memberLists;
    }

    function onResetClick() {
        if (formRef.current) {
            formRef.current.reset();
        }

        onReset();
        setResult(undefined);
    }

    async function handleFormSubmit(formData: FormData) {
        if (!project) return;

        const membersData = membersList.map((member, index) => ({
            userId: member.member.id,
            title: formData.get(`members[${member.member.id}].title`) as string,
            canEdit:
                formData.get(`members[${member.member.id}].canEdit`) === "on",
        })) satisfies z.infer<typeof editMemberArray>;

        const membersToUpdate = membersData.filter((member) =>
            originalProjectMembers.some(
                (originalMember) => originalMember.id === member.userId,
            ),
        );

        const membersToRemove = originalProjectMembers.filter(
            (originalMember) =>
                !membersData.some(
                    (member) => member.userId === originalMember.id,
                ),
        );

        const membersToAdd = membersData.filter(
            (member) =>
                !originalProjectMembers.some(
                    (originalMember) => originalMember.id === member.userId,
                ),
        );

        const res = await fetchEditProjectSettingsMembers(
            project.id,
            {
                membersToAdd,
                membersToDelete: membersToRemove.map((member) => member.id),
                membersToUpdate,
            },
            pathname,
        );
        setResult(res);

        if (res.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
                    <p>Successfully updated project members</p>
                </div>,
            );
        }
    }

    useEffect(() => {
        const members = constructMemberLists();

        if (JSON.stringify(members) === JSON.stringify(membersList)) {
            return;
        }

        setMembersList(members);
    }, [usersInTheSystem, project?.projectMembers]);

    function detectChanges() {
        if (!initialFormState || !formRef.current) {
            return;
        }

        const formData = new FormData(formRef.current);
        const formState = JSON.stringify({
            members: membersList.map((member) => ({
                id: member.member.id,
                title: formData.get(`members[${member.member.id}].title`),
                canEdit: Boolean(
                    formData.get(`members[${member.member.id}].canEdit`),
                ),
            })),
        });

        setIsFormModified(formState !== initialFormState);
    }

    function updateInitialFormState() {
        if (!project) {
            return;
        }

        setInitialFormState(
            JSON.stringify({
                members: project.projectMembers.map((member) => ({
                    id: member.user.id,
                    title: member.title,
                    canEdit: member.canEdit,
                })),
            }),
        );
    }

    useEffect(() => {
        detectChanges();
    }, [membersList, initialFormState]);

    useEffect(() => {
        updateInitialFormState();
    }, [project, originalProjectMembers]);

    return (
        <Card>
            <h1 className="text-2xl">Project members</h1>
            <form
                ref={formRef}
                onChange={detectChanges}
                action={handleFormSubmit}
            >
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName>Title</ColumName>
                        <ColumName>Can Edit</ColumName>
                        <ColumName className="flex justify-end font-normal">
                            <Tooltip
                                title="Add member to project"
                                className="font-normal"
                            >
                                <Button
                                    onClick={onOpenSelector}
                                    square={true}
                                    variant="primary"
                                    type="button"
                                >
                                    <IconPlus></IconPlus>
                                </Button>
                            </Tooltip>
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {membersList.length > 0 ? MemberLists : <NoMember />}
                    </TableBody>
                </Table>
                {showSelectorOverlay && (
                    <Selector
                        className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto"
                        selectorTitle="Add members to project"
                        searchPlaceholder="Search members"
                        checkListTitle="Members"
                        checkList={itemsCheckList || []}
                        onSearchChange={onSearchChange}
                        onCancel={onCloseSelector}
                        onConfirm={onConfirm}
                        onCheckChange={onCheckChange}
                        searchTerm={searchTerm}
                    />
                )}
                <div className="flex justify-end">
                    {isFormModified && (
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
                    )}
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

function NoMember() {
    return (
        <TableRow>
            <Cell>No member in the project!</Cell>
        </TableRow>
    );
}

function Member({
    member,
    title,
    canEdit,
    onRemove,
    onCanEditChange,
}: {
    member: UserWithoutPassword;
    title: string;
    canEdit: boolean;
    onRemove: (id: string) => void;
    onCanEditChange: (id: string, canEdit: boolean) => void;
}) {
    return (
        <TableRow className="align-middle">
            <Cell className="text-center">{`${member.firstName} ${member.lastName}`}</Cell>
            <Cell className="text-center">
                <InputField
                    defaultValue={title}
                    name={`members[${member.id}].title`}
                />
            </Cell>
            <Cell className="text-center">
                <div className="flex items-center justify-center">
                    <ToggleSwitch
                        defaultState={canEdit}
                        onChange={(checked) => {
                            onCanEditChange(member.id, checked);
                        }}
                    />
                </div>
                <InputField
                    readOnly
                    hidden
                    className="hidden"
                    type="checkbox"
                    checked={canEdit}
                    name={`members[${member.id}].canEdit`}
                />
            </Cell>
            <Cell>
                <div className="flex justify-end gap-2">
                    <Tooltip title="Remove member from project">
                        <Button
                            square={true}
                            variant="danger"
                            type="button"
                            onClick={() => {
                                onRemove(member.id);
                            }}
                        >
                            <IconX></IconX>
                        </Button>
                    </Tooltip>
                </div>
            </Cell>
        </TableRow>
    );
}
