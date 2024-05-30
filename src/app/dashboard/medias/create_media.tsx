"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus, IconUpload, IconX } from "@tabler/icons-react";
// import { fetchCreateMedia } from "./fetch";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fetchCreateMedia } from "./fetch";

export function CreateMediaOverlay() {
    const pathname = usePathname();
    const [files, setFiles] = useState<File[]>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateMedia>>>();

    function removeFile(index: number) {
        setFiles((prev) => {
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
            setFiles((prev) => {
                if (prev) {
                    // convert newFiles to array and add new files
                    return [...prev, ...Array.from(newFiles)];
                }
                return Array.from(newFiles);
            });
        }
    }

    async function onSubmit(formData: FormData) {
        for (const file of files || []) {
            formData.append("images", file);
        }

        const result = await fetchCreateMedia(
            formData,
            pathname,
        );
        setResult(result);
    }

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button
                onClick={() => setShowOverlay(true)}
                square={true}
                type="button"
                variant="primary"
            >
                <IconPlus></IconPlus>
            </Button>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[480px] font-normal">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Create Media
                            </h1>
                        </div>
                        <form
                            className="flex flex-col gap-2"
                            action={onSubmit}
                        >
                            <div className="flex flex-col items-start">
                                <label htmlFor="title" className="font-normal">
                                    Title
                                </label>
                                <InputField name="title" id="title" />
                            </div>
                            <div className="flex flex-col items-start">
                                <label
                                    htmlFor="description"
                                    className="font-normal"
                                >
                                    Description
                                </label>
                                <InputField
                                    type="description"
                                    name="description"
                                    id="description"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label htmlFor="date" className="font-normal">
                                    Date
                                </label>
                                <InputField type="date" name="date" id="date" />
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
                                        accept="image/*"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {files &&
                                        files.map((file, index) => {
                                            return (
                                                <div
                                                    className="relative"
                                                    key={
                                                        file.name +
                                                        file.size +
                                                        file.type
                                                    }
                                                >
                                                    <div className="absolute top-0 right-0">
                                                        <Button
                                                            variant="outline"
                                                            square
                                                            onClick={() =>
                                                                removeFile(
                                                                    index,
                                                                )
                                                            }
                                                            type="button"
                                                        >
                                                            <IconX
                                                                color="red"
                                                                size={20}
                                                                stroke={1.5}
                                                            />
                                                        </Button>
                                                    </div>
                                                    <ImageWithFallback
                                                        src={URL.createObjectURL(
                                                            file,
                                                        )}
                                                        alt="media photo"
                                                        // on hover, i want to show x red button to remove the image
                                                        className="aspect-square object-cover rounded-sm"
                                                        width={128}
                                                        height={128}
                                                    />
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            {!result?.success && result?.errors && (
                                <FormErrorMessages errors={result?.errors} />
                            )}
                            <div className="flex justify-end gap-2 my-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <CreateMediaBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function CreateMediaBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
