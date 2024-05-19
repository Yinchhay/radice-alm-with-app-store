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
import { projectMembers, users } from "@/drizzle/schema";
import { ProjectMemberAddMemberOverlay } from "./project_member_add_member";
import { useFormStatus } from "react-dom";
import { IconX } from "@tabler/icons-react";

export default function ProjectMember({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    const MemberLists = project.projectMembers.map((member) => {
        return <Member key={member.id} member={member} />;
    });

    return (
        <Card>
            <h1 className="text-2xl">Project members</h1>
            <Table className="my-4 w-full">
                <TableHeader>
                    <ColumName>Name</ColumName>
                    <ColumName>Title</ColumName>
                    <ColumName>Can Edit</ColumName>
                    <ColumName className="flex justify-end">
                        <ProjectMemberAddMemberOverlay />
                    </ColumName>
                </TableHeader>
                <TableBody>
                    {project?.projectMembers.length > 0 ? (
                        MemberLists
                    ) : (
                        <NoMember />
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

function NoMember() {
    return (
        <TableRow>
            <Cell>No member in the project!</Cell>
        </TableRow>
    );
}

export type MemberJoinUser = typeof projectMembers.$inferSelect & {
    user: typeof users.$inferSelect;
};
function Member({ member }: { member: MemberJoinUser }) {
    return (
        <TableRow className="align-middle">
            <Cell className="text-center">{`${member.user.firstName} ${member.user.lastName}`}</Cell>
            <Cell className="text-center">{member.title}</Cell>
            <Cell className="text-center">
                <div className="flex items-center justify-center">
                    <ToggleSwitch />
                </div>
            </Cell>
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
