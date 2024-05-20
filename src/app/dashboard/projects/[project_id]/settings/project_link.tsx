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
import { IconX } from "@tabler/icons-react";
import { useFormStatus } from "react-dom";

export default function ProjectLink({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    // TODO: Update the link type
    const links = project.links || [] as any;

    const LinkLists = links.map((link: any) => {
        return <Link key={link.id} link={link} />;
    });

    return (
        <Card>
            <h1 className="text-2xl">Project links</h1>
            <Table className="my-4 w-full">
                <TableHeader>
                    <ColumName>Link name</ColumName>
                    <ColumName className="flex justify-end">
                        {/* <ProjectLinkAddLinkOverlay /> */}
                    </ColumName>
                </TableHeader>
                <TableBody>
                    {links.length > 0 ? LinkLists : <NoLink />}
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

function NoLink() {
    return (
        <TableRow>
            <Cell>No link in the project!</Cell>
        </TableRow>
    );
}

// TODO: Update the link type
function Link({ link }: { link: any }) {
    return (
        <TableRow className="align-middle">
            <Cell className="text-center">add link name later</Cell>
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
