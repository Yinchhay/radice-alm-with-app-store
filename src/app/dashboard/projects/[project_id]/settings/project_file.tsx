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
import { readableFileSize } from "@/lib/file";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchEditProjectSettingsFiles } from "./fetch";
import FormErrorMessages from "@/components/FormErrorMessages";
import { usePathname } from "next/navigation";

export type FileList = {
    file?: File;
    filename: string;
    size: string;
};
export default function ProjectFile({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project not found");
    }

    const pathname = usePathname();
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditProjectSettingsFiles>>>();
    const [fileLists, setFileLists] = useState<FileList[]>(project.files);
    const imageRef = useRef<HTMLInputElement>(null);

    function handleUploadFilesClick() {
        if (!imageRef.current) {
            return;
        }

        imageRef.current.click();
    }

    function handleUploadFiles() {
        if (!imageRef.current || !imageRef.current.files) {
            return;
        }

        const files = imageRef.current.files;
        if (!files) {
            return;
        }

        const newFileLists: FileList[] = [];
        for (const file of files) {
            if (fileLists.find((f) => f.filename === file.name)) {
                continue;
            }

            newFileLists.push({
                file,
                filename: file.name,
                size: file.size.toString(),
            });
        }

        setFileLists([...fileLists, ...newFileLists]);
    }

    function handleDeleteFile(index: number) {
        const newFileLists = fileLists.filter((_, i) => i !== index);
        setFileLists(newFileLists);
    }

    const FileLists = fileLists.map((file, index) => (
        <FileRow
            key={index}
            file={file}
            onDeleteClick={() => handleDeleteFile(index)}
        />
    ));

    async function handleSubmit() {
        if (!project) {
            return;
        }

        const formData = new FormData();
        const fileToRemove = project.files
            .filter((f) => !fileLists.find((fl) => fl.filename === f.filename))
            .map((f) => {
                formData.append("fileToRemove", f.filename);
                return f.filename;
            });

        const fileToUpload = fileLists
            .map((f) => {
                if (f.file instanceof File) {
                    return f.file;
                }
            })
            .filter((f) => {
                if (f instanceof File) {
                    formData.append("fileToUpload", f);
                    return true;
                }
            });

        const response = await fetchEditProjectSettingsFiles(
            project.id,
            formData,
            pathname,
        );
        setResult(response);
    }

    function onResetClick() {
        if (!project) {
            return;
        }

        setFileLists(project.files);
        setResult(undefined);
    }

    useEffect(() => {
        setFileLists(project.files);
    }, [project.files])

    return (
        <Card>
            <h1 className="text-2xl">Project files</h1>
            <form action={handleSubmit}>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Filename</ColumName>
                        <ColumName>size</ColumName>
                        <ColumName className="flex justify-end">
                            <input
                                hidden
                                className="hidden"
                                type="file"
                                ref={imageRef}
                                multiple
                                onChange={handleUploadFiles}
                            />
                            <Button
                                onClick={handleUploadFilesClick}
                                square={true}
                                variant="primary"
                                type="button"
                            >
                                <IconPlus></IconPlus>
                            </Button>
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {fileLists.length > 0 ? FileLists : <NoFile />}
                    </TableBody>
                </Table>
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

function NoFile() {
    return (
        <TableRow>
            <Cell>No file in the project!</Cell>
        </TableRow>
    );
}

function FileRow({
    file,
    onDeleteClick,
}: {
    file: FileList;
    onDeleteClick: () => void;
}) {
    const fileSizeToString = (size: string) => {
        // if file already converted to string skip
        if (size.includes("B")) {
            return size;
        }

        return readableFileSize(Number(size));
    };

    return (
        <TableRow className="align-middle">
            <Cell className="text-center">{file.filename}</Cell>
            <Cell className="text-center">{fileSizeToString(file.size)}</Cell>
            <Cell>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        square={true}
                        variant="danger"
                        onClick={onDeleteClick}
                    >
                        <IconX></IconX>
                    </Button>
                </div>
            </Cell>
        </TableRow>
    );
}
