"use client";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import Cell from "@/components/table/Cell";
import ColumName from "@/components/table/ColumnName";
import Table from "@/components/table/Table";
import TableBody from "@/components/table/TableBody";
import TableHeader from "@/components/table/TableHeader";
import TableRow from "@/components/table/TableRow";
import { ProjectLink } from "@/drizzle/schema";
import {
    formatZodError,
    generateAndFormatZodError,
    T_ZodErrorFormatted,
} from "@/lib/form";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchEditProjectSettingsLinks } from "./fetch";
import { usePathname } from "next/navigation";
import { editProjectSettingsLinks } from "@/app/api/internal/project/[project_id]/schema";
import Tooltip from "@/components/Tooltip";
import { useToast } from "@/components/Toaster";

export default function ProjectSettingLink({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project not found");
    }
    const [links, setLinks] = useState(project.links || []);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditProjectSettingsLinks>>>();
    const pathname = usePathname();

    const { addToast } = useToast();

    const [initialFormState, setInitialFormState] = useState<string>();
    const [isFormModified, setIsFormModified] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);

    function addLink(link: ProjectLink) {
        setLinks([...links, link]);
    }

    function removeLink(link: ProjectLink) {
        setLinks(links.filter((l) => l !== link));
    }

    function onOneLinkChange(
        index: number,
        key: keyof ProjectLink,
        value: any,
    ) {
        const newLinks = [...links];
        newLinks[index] = {
            ...newLinks[index],
            [key]: value,
        };

        setLinks(newLinks);
    }

    function onReset() {
        if (!project) {
            return;
        }

        if (formRef.current) {
            formRef.current.reset();
        }
        setLinks(project.links || []);
        setResult(undefined);
    }

    const LinkLists = links.map((link, index) => {
        return (
            <LinkCell
                onOneLinkChange={onOneLinkChange}
                key={index}
                link={link}
                onRemove={removeLink}
                index={index}
            />
        );
    });

    async function onSaveChanges() {
        if (!project) {
            return;
        }

        // Validate the links in client, to save unnecessary API calls. tho in api it still validate the data
        const validationResult = editProjectSettingsLinks.safeParse({
            links,
        });
        if (!validationResult.success) {
            return setResult({
                success: false,
                errors: formatZodError(validationResult.error),
                message: "Failed to save changes",
            });
        }

        const res = await fetchEditProjectSettingsLinks(
            project.id,
            links,
            pathname,
        );

        setResult(res);

        if (res.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
                    <p>Successfully updated project link</p>
                </div>,
            );
        }
    }

    useEffect(() => {
        setLinks(project.links || []);
    }, [project.links]);

    function detectChanges() {
        if (!initialFormState) {
            return;
        }

        const formState = JSON.stringify(links);

        setIsFormModified(formState !== initialFormState);
    }

    function updateInitialFormState() {
        if (!project) {
            return;
        }

        setInitialFormState(JSON.stringify(project.links || []));
    }

    useEffect(() => {
        detectChanges();
    }, [links, initialFormState]);

    useEffect(() => {
        updateInitialFormState();
    }, [project]);

    return (
        <>
            <Card>
                <h1 className="text-2xl">Project links</h1>
                <form action={onSaveChanges}
                    ref={formRef}
                    onChange={detectChanges}
                >
                    <Table className="my-4 w-full">
                        <TableHeader>
                            <ColumName>Link title</ColumName>
                            <ColumName>Link url</ColumName>
                            <ColumName className="flex justify-end font-normal">
                                <AddLinkOverlay addLink={addLink} />
                            </ColumName>
                        </TableHeader>
                        <TableBody>
                            {links.length > 0 ? LinkLists : <NoLink />}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end">
                        {isFormModified && (
                            <div className="flex gap-4">
                                <Button
                                    onClick={onReset}
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
        </>
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

function LinkCell({
    link,
    index,
    onOneLinkChange,
    onRemove,
}: {
    link: ProjectLink;
    index: number;
    onOneLinkChange: (
        index: number,
        key: keyof ProjectLink,
        value: any,
    ) => void;
    onRemove: (link: ProjectLink) => void;
}) {
    function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onOneLinkChange(index, "title", e.target.value);
    }

    function onLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
        onOneLinkChange(index, "link", e.target.value);
    }

    return (
        <TableRow className="align-middle">
            <Cell className="text-center">
                <InputField
                    defaultValue={link.title}
                    required
                    onChange={onTitleChange}
                />
            </Cell>
            <Cell className="text-center">
                <InputField
                    defaultValue={link.link}
                    required
                    onChange={onLinkChange}
                />
            </Cell>
            <Cell>
                <div className="flex justify-end gap-2">
                    <Tooltip title="Remove link from project">
                        <Button
                            square={true}
                            variant="danger"
                            type="button"
                            onClick={() => {
                                onRemove(link);
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

function AddLinkOverlay({ addLink }: { addLink: (link: ProjectLink) => void }) {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [errors, setErrors] = useState<T_ZodErrorFormatted<any>>();
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    function onCancel() {
        if (titleRef.current) {
            titleRef.current.value = "";
        }

        if (linkRef.current) {
            linkRef.current.value = "";
        }

        setErrors(undefined);
        setShowOverlay(false);
    }

    function validateLink(link: string): boolean {
        try {
            return !!new URL(link);
        } catch (error) {
            //  if the URL is invalid, it will throw an error
            return false;
        }
    }

    async function onAddLink() {
        const link = linkRef.current;
        const title = titleRef.current;

        if (!link?.value) {
            setErrors(generateAndFormatZodError("link", "Link is required"));
            return;
        }

        if (!title?.value) {
            setErrors(generateAndFormatZodError("title", "Title is required"));
            return;
        }

        if (!validateLink(link.value)) {
            setErrors(generateAndFormatZodError("link", "URL is invalid"));
            return;
        }

        addLink({
            link: link.value,
            title: title.value,
        });

        onCancel();
    }

    return (
        <>
            <Tooltip title="Add link to project">
                <Button
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    type="button"
                    variant="primary"
                >
                    <IconPlus></IconPlus>
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Add link
                            </h1>
                        </div>
                        <div className="flex flex-col items-start my-1">
                            <label htmlFor="title" className="font-normal">
                                Title
                            </label>
                            <InputField
                                name="title"
                                id="title"
                                required
                                ref={titleRef}
                            />
                        </div>
                        <div className="flex flex-col items-start my-1">
                            <label htmlFor="link" className="font-normal">
                                Link
                            </label>
                            <InputField
                                name="link"
                                id="link"
                                required
                                ref={linkRef}
                            />
                        </div>
                        {errors && <FormErrorMessages errors={errors} />}
                        <div className="flex justify-end gap-2 my-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={onAddLink}
                            >
                                Save
                            </Button>
                        </div>
                    </Card>
                </Overlay>
            )}
        </>
    );
}
