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
import { fileToUrl, readableFileSize } from "@/lib/file";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchEditProjectSettingsFiles } from "./fetch";
import FormErrorMessages from "@/components/FormErrorMessages";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import Link from "next/link";
import { extractFileDetails } from "@/lib/utils";
import { useToast } from "@/components/Toaster";

type FileLists = {
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
    const [fileLists, setFileLists] = useState<FileLists[]>(project.files);
    const imageRef = useRef<HTMLInputElement>(null);

    const { addToast } = useToast();

    const [initialFormState, setInitialFormState] = useState<string>();
    const [isFormModified, setIsFormModified] = useState<boolean>(false);

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

        const newFileLists: FileLists[] = [];
        for (const file of files) {
            newFileLists.push({
                file,
                filename: file.name,
                size: file.size.toString(),
            });
        }

        setFileLists([...fileLists, ...newFileLists]);

        // clear input file to allow upload same file
        imageRef.current.value = "";
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

        const res = await fetchEditProjectSettingsFiles(
            project.id,
            formData,
            pathname,
        );
        setResult(res);

        if (res.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
                    <p>Successfully updated project file</p>
                </div>,
            );
        }
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
    }, [project.files]);

    function detectChanges() {
        if (!initialFormState) {
            return;
        }

        const formState = JSON.stringify(fileLists);

        setIsFormModified(formState !== initialFormState);
    }

    function updateInitialFormState() {
        if (!project) {
            return;
        }

        setInitialFormState(JSON.stringify(project.files));
    }

    useEffect(() => {
        detectChanges();
    }, [fileLists, initialFormState]);

    useEffect(() => {
        updateInitialFormState();
    }, [project]);

    return (
        <Card>
            <h1 className="text-2xl">Project files</h1>
            <form action={handleSubmit}>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Filename</ColumName>
                        <ColumName>size</ColumName>
                        <ColumName className="flex justify-end font-normal">
                            <input
                                hidden
                                className="hidden"
                                type="file"
                                ref={imageRef}
                                multiple
                                onChange={handleUploadFiles}
                            />
                            <Tooltip title="Upload file to project">
                                <Button
                                    onClick={handleUploadFilesClick}
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
                        {fileLists.length > 0 ? FileLists : <NoFile />}
                    </TableBody>
                </Table>
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
    file: FileLists;
    onDeleteClick: () => void;
}) {
    const fileSizeToString = (size: string) => {
        // if file already converted to string skip
        if (size.includes("B")) {
            return size;
        }

        return readableFileSize(Number(size));
    };
    const fileIsStoredInStorage = file.file instanceof File;
    const fileDetail = extractFileDetails(file.filename);
    return (
        <TableRow className="align-middle">
            <Cell className="text-center">
                {fileIsStoredInStorage ? (
                    <Link
                        href={URL.createObjectURL(file?.file!)}
                        target="_blank"
                    >
                        {file.file?.name}
                    </Link>
                ) : (
                    <Link href={fileToUrl(file.filename)} target="_blank">
                        {fileDetail.name + fileDetail.extension}
                    </Link>
                )}
            </Cell>
            <Cell className="text-center">{fileSizeToString(file.size)}</Cell>
            <Cell>
                <div className="flex justify-end gap-2">
                    <Tooltip title="Remove file from project">
                        <Button
                            type="button"
                            square={true}
                            variant="danger"
                            onClick={onDeleteClick}
                        >
                            <IconX></IconX>
                        </Button>
                    </Tooltip>
                </div>
            </Cell>
        </TableRow>
    );
}
