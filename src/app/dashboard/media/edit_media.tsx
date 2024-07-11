"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { ChangeEvent, JSX, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconCheck, IconEdit, IconUpload, IconX } from "@tabler/icons-react";
import { media } from "@/drizzle/schema";
import { fetchEditMediaById } from "./fetch";
import { usePathname } from "next/navigation";
import TextareaField from "@/components/TextareaField";
import Tooltip from "@/components/Tooltip";
import ImageWithFallback from "@/components/ImageWithFallback";
import { ACCEPTED_IMAGE_TYPES, fileToUrl } from "@/lib/file";
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { existingMediaFilesSchema } from "@/app/api/internal/media/schema";
import { z } from "zod";
import { useToast } from "@/components/Toaster";

type FileLists = {
    file?: File;
    filename: string;
    id: string;
};

export function EditMediaOverlay({
    mediaOne,
}: {
    mediaOne: typeof media.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [fileLists, setFileLists] = useState<FileLists[]>(
        mediaOne.files.map((file) => {
            return {
                file: undefined,
                filename: file.filename,
                id: crypto.randomUUID(),
            };
        }),
    );
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditMediaById>>>();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, keyboardSensor);

    function onCancel() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setFileLists(
            mediaOne.files.map((file) => {
                return {
                    file: undefined,
                    filename: file.filename,
                    id: crypto.randomUUID(),
                };
            }),
        );
        setResult(undefined);
        setShowOverlay(false);
    }

    async function onSubmit(formData: FormData) {
        // follow this schema
        // body: z.infer<typeof editMediaSchema>,
        const existingFiles: z.infer<typeof existingMediaFilesSchema> = [];
        const imgUploadOrder: number[] = [];

        fileLists.forEach((file, index) => {
            if (file.file) {
                formData.append(`imagesToUpload`, file.file);
                imgUploadOrder.push(index);
            } else {
                existingFiles.push({
                    order: index,
                    filename: file.filename,
                });
            }
        });

        formData.append("existingMediaFiles", JSON.stringify(existingFiles));
        formData.append("imagesToUploadOrder", JSON.stringify(imgUploadOrder));

        const result = await fetchEditMediaById(
            mediaOne.id,
            formData,
            pathname,
        );
        setResult(result);
    }

    function removeFile(index: number) {
        setFileLists((prev) => {
            if (prev) {
                const newList = [...prev];
                newList.splice(index, 1);
                return newList;
            }
            return prev;
        });
    }

    function addMoreFiles(event: ChangeEvent<HTMLInputElement>) {
        // add only new file from the event. keep the files the same
        const newFiles = event.target.files;
        if (newFiles) {
            const newFilesArray = Array.from(newFiles).map((file) => ({
                file,
                filename: URL.createObjectURL(file),
                id: crypto.randomUUID(),
            }));

            setFileLists((prev) => {
                if (prev) {
                    // convert newFiles to array and add new files
                    return [...prev, ...newFilesArray];
                }
                return newFilesArray;
            });
        }

        // clear the input value to allow adding the same file again
        fileInputRef.current!.value = "";
    }

    function handlePhotoDrag(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) {
            return;
        }

        if (active.id !== over.id) {
            setFileLists((prev) => {
                // since i use index as id, i can just swap the index
                const oldIndex = prev.findIndex(
                    (file) => file.id === active.id,
                );
                const newIndex = prev.findIndex((file) => file.id === over.id);

                return arrayMove(prev, Number(oldIndex), Number(newIndex));
            });
        }
    }

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && result?.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
                    <p>
                        Successfully edited{" "}
                        <strong className="capitalize">{mediaOne.title}</strong>
                    </p>
                </div>,
            );
            onCancel();
        }
    }, [result]);

    return (
        <>
            <Tooltip className="group" title="Edit media">
                <Button
                    onClick={() => setShowOverlay(true)}
                    square
                    variant="outline"
                    className="outline-0"
                >
                    <IconEdit
                        size={28}
                        className="group-hover:text-blue-500 transition-all"
                        stroke={1.3}
                    />
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Edit Media
                            </h1>
                        </div>
                        <form className="flex flex-col gap-2" action={onSubmit}>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="title" className="font-normal">
                                    Title
                                </label>
                                <InputField
                                    name="title"
                                    id="title"
                                    defaultValue={mediaOne.title}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="description"
                                    className="font-normal"
                                >
                                    Description
                                </label>
                                <TextareaField
                                    className="h-36"
                                    name="description"
                                    id="description"
                                    defaultValue={mediaOne.description ?? ""}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="date" className="font-normal">
                                    Date
                                </label>
                                <InputField
                                    type="date"
                                    name="date"
                                    id="date"
                                    defaultValue={
                                        new Date(mediaOne.date)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    required
                                />
                            </div>
                            <div className="flex flex-col items-start gap-4">
                                <div className="flex gap-2 justify-center items-center">
                                    <label
                                        htmlFor="mediaLogo"
                                        className="font-normal"
                                    >
                                        Photos
                                    </label>
                                    <Button
                                        square
                                        variant="outline"
                                        className="outline-0"
                                        type="button"
                                        onClick={() => {
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <IconUpload
                                            size={24}
                                            className="group-hover:text-blue-500 transition-all"
                                            stroke={1.3}
                                        />
                                    </Button>
                                    <InputField
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            addMoreFiles(e);
                                        }}
                                        hidden
                                        className="hidden"
                                        type="file"
                                        multiple
                                        name="mediaLogo"
                                        id="mediaLogo"
                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <DndContext
                                    sensors={sensors}
                                    onDragEnd={handlePhotoDrag}
                                >
                                    <SortableContext items={fileLists}>
                                        {fileLists &&
                                            fileLists.map((file, index) => {
                                                return (
                                                    <SortableMediaImage
                                                        key={file.id}
                                                        fileList={file}
                                                        onRemoveFile={() =>
                                                            removeFile(index)
                                                        }
                                                    />
                                                );
                                            })}
                                    </SortableContext>
                                </DndContext>
                            </div>
                            {!result?.success && result?.errors && (
                                <FormErrorMessages errors={result?.errors} />
                            )}
                            <div className="flex justify-end gap-2 my-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <EditMediaBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function SortableMediaImage({
    fileList,
    onRemoveFile,
}: {
    fileList: FileLists;
    onRemoveFile: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: fileList.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            className="relative"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div className="absolute top-0 right-0">
                <Button
                    variant="outline"
                    square
                    onClick={onRemoveFile}
                    type="button"
                >
                    <IconX color="red" size={20} stroke={1.5} />
                </Button>
            </div>
            <ImageWithFallback
                src={
                    // fileList.file
                    //     ? URL.createObjectURL(fileList.file)
                    // : fileToUrl(fileList.filename)
                    fileToUrl(fileList.filename)
                }
                alt="media photo"
                className="aspect-square object-cover rounded-sm"
                width={128}
                height={128}
            />
        </div>
    );
}

function EditMediaBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Saving" : "Save"}
        </Button>
    );
}
function addToast(arg0: JSX.Element) {
    throw new Error("Function not implemented.");
}
