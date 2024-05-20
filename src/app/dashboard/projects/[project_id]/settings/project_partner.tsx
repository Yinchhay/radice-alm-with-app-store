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
import { projectPartners, users } from "@/drizzle/schema";
import { IconX } from "@tabler/icons-react";
import { useFormStatus } from "react-dom";

export default function ProjectPartner({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    const PartnerLists = project.projectPartners.map((partner) => {
        return <Partner key={partner.id} partner={partner} />;
    });

    return (
        <Card>
            <h1 className="text-2xl">Project partners</h1>
            <Table className="my-4 w-full">
                <TableHeader>
                    <ColumName>Name</ColumName>
                    <ColumName className="flex justify-end">
                        {/* <ProjectPartnerAddPartnerOverlay /> */}
                    </ColumName>
                </TableHeader>
                <TableBody>
                    {project?.projectPartners.length > 0 ? (
                        PartnerLists
                    ) : (
                        <NoPartner />
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-end">
                <div className="flex gap-4">
                    <Button
                        // onClick={onResetClick}
                        variant="secondary"
                        type="button"
                    >
                        Reset
                    </Button>
                    <SaveChangesBtn />
                </div>
            </div>
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

export type PartnerJoinUser = typeof projectPartners.$inferSelect & {
    partner: typeof users.$inferSelect;
};
function Partner({ partner }: { partner: PartnerJoinUser }) {
    return (
        <TableRow className="align-middle">
            <Cell className="text-center">{`${partner.partner.firstName} ${partner.partner.lastName}`}</Cell>
            <Cell>
                <div className="flex justify-end gap-2">
                    <Button square={true} variant="danger">
                        <IconX></IconX>
                    </Button>
                </div>
            </Cell>
        </TableRow>
    );
}
