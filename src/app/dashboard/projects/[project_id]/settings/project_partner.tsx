"use client";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import { editPartnerArray } from "@/app/api/internal/project/[project_id]/schema";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { CheckBoxElement } from "@/components/CheckList";
import Cell from "@/components/table/Cell";
import ColumName from "@/components/table/ColumnName";
import Table from "@/components/table/Table";
import TableBody from "@/components/table/TableBody";
import TableHeader from "@/components/table/TableHeader";
import TableRow from "@/components/table/TableRow";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { z } from "zod";
import {
    fetchEditProjectSettingsPartners,
    fetchPartnersBySearch,
} from "./fetch";
import Selector from "@/components/Selector";
import FormErrorMessages from "@/components/FormErrorMessages";
import { usePathname } from "next/navigation";
import { UserWithoutPassword } from "./project_member";
import Tooltip from "@/components/Tooltip";
import { useSelector } from "@/hooks/useSelector";
import { localDebug } from "@/lib/utils";

export type PartnerList = {
    partner: UserWithoutPassword;
};

export default function ProjectPartner({
    project,
    originalProjectPartners,
}: {
    project: FetchOneAssociatedProjectData["project"];
    originalProjectPartners: UserWithoutPassword[];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    async function fetchPartnersBySearchCallback(search: string) {
        try {
            const response = await fetchPartnersBySearch(search, 10);
            if (response.success) {
                return response.data.partners as UserWithoutPassword[];
            }
        } catch (error) {
            localDebug(
                "Error fetching partner by search",
                "project_partner.tsx",
            );
        }

        return [];
    }

    const pathname = usePathname();
    const {
        showSelectorOverlay,
        itemsCheckList,
        checkedItems,
        checkedItemsValues: partnersInTheSystem,
        searchTerm,
        onSearchChange,
        onOpenSelector,
        onCheckChange,
        onCloseSelector,
        onRemoveItem,
        onReset,
        onConfirm,
    } = useSelector(
        fetchPartnersBySearchCallback,
        originalProjectPartners,
        "firstName",
        "id",
    );

    const [result, setResult] =
        useState<
            Awaited<ReturnType<typeof fetchEditProjectSettingsPartners>>
        >();
    const [partnersList, setPartnersList] = useState<PartnerList[]>([]);

    function removePartnerById(id: string) {
        onRemoveItem(id);
    }

    const PartnerLists = partnersList.map((partner) => (
        <Partner
            key={partner.partner.id}
            partner={partner.partner}
            onRemove={removePartnerById}
        />
    ));

    function constructPartnerLists() {
        const partnerLists: PartnerList[] = [];

        checkedItems.forEach((partner) => {
            if (partner.checked) {
                const partnerDetail = partnersInTheSystem.find(
                    (user) => user.id === partner.value,
                );
                const partnerAlreadyInProject = project?.projectPartners.find(
                    (projectPartner) =>
                        projectPartner.partner.id === partner.value,
                );
                if (partnerDetail) {
                    partnerLists.push({
                        partner: partnerDetail,
                    });
                }
            }
        });

        return partnerLists;
    }

    function onResetClick() {
        onReset();
        setResult(undefined);
    }

    async function handleFormSubmit(formData: FormData) {
        if (!project) return;

        const partnersData = partnersList.map(
            (partner) => partner.partner.id,
        ) satisfies z.infer<typeof editPartnerArray>;

        const partnersToDelete = originalProjectPartners.filter(
            (originalPartner) =>
                !partnersData.some(
                    (partnerId) => partnerId === originalPartner.id,
                ),
        );

        const partnersToAdd = partnersData.filter(
            (partnerId) =>
                !originalProjectPartners.some(
                    (originalPartner) => originalPartner.id === partnerId,
                ),
        );

        const response = await fetchEditProjectSettingsPartners(
            project.id,
            {
                partnersToAdd,
                partnersToDelete: partnersToDelete.map((partner) => partner.id),
            },
            pathname,
        );
        setResult(response);
    }

    useEffect(() => {
        const partners = constructPartnerLists();
        setPartnersList(partners);
    }, [checkedItems, partnersInTheSystem, project.projectPartners]);

    return (
        <Card>
            <h1 className="text-2xl">Project partners</h1>
            <form action={handleFormSubmit}>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName className="flex justify-end font-normal">
                            <Tooltip title="Add partner to project">
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
                        {partnersList.length > 0 ? PartnerLists : <NoPartner />}
                    </TableBody>
                </Table>
                {showSelectorOverlay && (
                    <Selector
                        className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto"
                        selectorTitle="Add partners to project"
                        searchPlaceholder="Search partners"
                        checkListTitle="Partners"
                        checkList={itemsCheckList || []}
                        onSearchChange={onSearchChange}
                        onCancel={onCloseSelector}
                        onConfirm={onConfirm}
                        onCheckChange={onCheckChange}
                        searchTerm={searchTerm}
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

function NoPartner() {
    return (
        <TableRow>
            <Cell>No partner in the project!</Cell>
        </TableRow>
    );
}

function Partner({
    partner,
    onRemove,
}: {
    partner: UserWithoutPassword;
    onRemove: (id: string) => void;
}) {
    return (
        <TableRow className="align-middle">
            <Cell className="text-center">{`${partner.firstName} ${partner.lastName}`}</Cell>
            <Cell>
                <div className="flex justify-end gap-2">
                    <Tooltip title="Remove partner from project">
                        <Button
                            square={true}
                            variant="danger"
                            type="button"
                            onClick={() => {
                                onRemove(partner.id);
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
