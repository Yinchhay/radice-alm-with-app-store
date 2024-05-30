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
import { IconPlus, IconX } from "@tabler/icons-react";
import { useSelector } from "../../../../../hooks/useSelector";
import Selector from "@/components/Selector";
import InputField from "@/components/InputField";
import { CheckBoxElement } from "@/components/CheckList";
import { useEffect, useState } from "react";
import { fetchEditProjectSettingsMembers } from "./fetch";
import FormErrorMessages from "@/components/FormErrorMessages";
import { editMemberArray } from "@/app/api/internal/project/[project_id]/schema";
import { z } from "zod";
import { usePathname } from "next/navigation";

export type MemberList = {
    member: typeof users.$inferSelect;
    title: string;
    canEdit: boolean;
};

export default function ProjectMember({
    project,
    usersInTheSystem,
    originalProjectMembers,
}: {
    project: FetchOneAssociatedProjectData["project"];
    usersInTheSystem: (typeof users.$inferSelect)[];
    originalProjectMembers: (typeof users.$inferSelect)[];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    const pathname = usePathname();
    const {
        showSelectorOverlay,
        openSelector,
        onSearchChange,
        onCheckChange,
        onCancel,
        onConfirm,
        onReset,
        itemsCheckListDisplay,
        checkedItems,
    } = useSelector(
        usersInTheSystem,
        originalProjectMembers,
        "firstName",
        "id",
    );

    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditProjectSettingsMembers>>>();
    const [membersList, setMembersList] = useState<MemberList[]>([]);

    // update the memberList to enforce switch to reset
    function onCanEditChange(id: string, canEdit: boolean) {
        setMembersList((prevMembersList) =>
            prevMembersList.map((member) => {
                if (member.member.id === id) {
                    return { ...member, canEdit };
                }
                return member;
            }),
        );
    }

    function removeMemberById(id: string) {
        const toBeRemoved = {
            name:
                usersInTheSystem.find((user) => user.id === id)?.firstName ||
                "",
            checked: false,
            value: id,
        } satisfies CheckBoxElement;

        onCheckChange([], toBeRemoved, true);
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

        checkedItems.forEach((member) => {
            if (member.checked) {
                const memberDetail = usersInTheSystem.find(
                    (user) => user.id === member.value,
                );
                const memberAlreadyInProject = project?.projectMembers.find(
                    (projectMember) => projectMember.user.id === member.value,
                );
                if (memberDetail) {
                    memberLists.push({
                        member: memberDetail,
                        title: memberAlreadyInProject?.title || "",
                        canEdit: memberAlreadyInProject?.canEdit || false,
                    });
                }
            }
        });

        return memberLists;
    }

    function onResetClick() {
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

        const response = await fetchEditProjectSettingsMembers(
            project.id,
            {
                membersToAdd,
                membersToDelete: membersToRemove.map((member) => member.id),
                membersToUpdate,
            },
            pathname,
        );
        setResult(response);
    }

    useEffect(() => {
        const members = constructMemberLists();
        setMembersList(members);
    }, [checkedItems]);

    return (
        <Card>
            <h1 className="text-2xl">Project members</h1>
            <form action={handleFormSubmit}>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName>Title</ColumName>
                        <ColumName>Can Edit</ColumName>
                        <ColumName className="flex justify-end">
                            <Button
                                onClick={openSelector}
                                square={true}
                                variant="primary"
                                type="button"
                            >
                                <IconPlus></IconPlus>
                            </Button>
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {membersList.length > 0 ? MemberLists : <NoMember />}
                    </TableBody>
                </Table>
                {showSelectorOverlay && (
                    <Selector
                        className="w-[420px]"
                        selectorTitle="Add users to project"
                        searchPlaceholder="Search users"
                        checkListTitle="Users"
                        checkList={itemsCheckListDisplay || []}
                        onSearchChange={onSearchChange}
                        onCheckChange={onCheckChange}
                        onCancel={onCancel}
                        onConfirm={onConfirm}
                    />
                )}
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
    member: typeof users.$inferSelect;
    title: string;
    canEdit: boolean;
    onRemove: (id: string) => void;
    onCanEditChange: (id: string, canEdit: boolean) => void;
}) {
    const [canEditState, setCanEditState] = useState(canEdit);

    useEffect(() => {
        setCanEditState(canEdit);
    }, [canEdit]);

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
                        defaultState={canEditState}
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
                    checked={canEditState}
                    name={`members[${member.id}].canEdit`}
                />
            </Cell>
            <Cell>
                <div className="flex justify-end gap-2">
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
                </div>
            </Cell>
        </TableRow>
    );
}
