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

export default function ProjectFile({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    const FileLists = project.files.map((file) => {
        return <File key={file.id} file={file} />;
    });

    return (
        <Card>
            <h1 className="text-2xl">Project files</h1>
            <Table className="my-4 w-full">
                <TableHeader>
                    <ColumName>File name</ColumName>
                    <ColumName className="flex justify-end">
                        {/* <ProjectFileAddFileOverlay /> */}
                    </ColumName>
                </TableHeader>
                <TableBody>
                    {project?.files.length > 0 ? FileLists : <NoFile />}
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

function NoFile() {
    return (
        <TableRow>
            <Cell>No file in the project!</Cell>
        </TableRow>
    );
}

// TODO: Update the file type
function File({ file }: { file: any }) {
    return (
        <TableRow className="align-middle">
            <Cell className="text-center">add file name later</Cell>
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
