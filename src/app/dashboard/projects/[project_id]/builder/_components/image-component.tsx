"use client";
import { Component } from "@/types/content";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { getSessionCookie } from "@/lib/server_utils";
import { deleteFile, fileToUrl, uploadFiles } from "@/lib/file";
import { FileBelongTo } from "@/drizzle/schema";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function ImageComponent({
    component,
    onSave,
    onDelete,
    onSelected,
    selectedComponentID,
    projectId,
}: {
    component: Component;
    onSave: (newData: Component) => void;
    onDelete: (ID: string) => void;
    onSelected: (ID: string) => void;
    selectedComponentID: string;
    projectId: string;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [fileList, setFileList] = useState<FileList>();
    const [imageSrc, setImageSrc] = useState<string>(
        component.text ? component.text : "/placeholder.webp",
    );
    const buttonRef = useRef<HTMLButtonElement>(null);

    function Cancel() {
        setImageSrc(component.text ? component.text : "/placeholder.webp");
        setFileList(undefined);
    }
    useEffect(() => {
        if (isDragging) {
            onSelected("");
        }
    }, [isDragging]);

    useEffect(() => {
        async function saveImage() {
            setShowEdit(false);

            let newData = component;
            let newImg = await changeImage();
            if (fileList) {
                if (newImg) {
                    newData.text = newImg;
                    setImageSrc(newImg);
                } else {
                    newData.text = "/placeholder.webp";
                    setImageSrc("/placeholder.webp");
                }
            }
            onSave(newData);
        }
        if (selectedComponentID == component.id) {
            setShowEdit(true);
        } else if (showEdit) {
            saveImage();
        }
    }, [selectedComponentID]);

    async function changeImage() {
        if (fileList) {
            const sessionId = await getSessionCookie();
            if (component.text) {
                if (component.text != "/placeholder.webp") {
                    const deleteOldImage = await deleteFile(
                        component.text,
                        sessionId ?? "",
                    );
                    //console.log(deleteOldImage.message);
                }
                //console.log("Not initail iamge");
            }
            const files = [fileList[0]];
            //console.log("trying to upload");
            const newUpload = await uploadFiles(files, {
                sessionId: sessionId ?? "",
                projectId: Number(projectId),
                belongTo: FileBelongTo.ContentBuilder,
            });
            if (newUpload.success) {
                //console.log(fileToUrl(newUpload.data.filenames[0]));
                return newUpload.data.filenames[0];
            } else {
                //console.log(newUpload.message);
            }
            return "/placeholder.webp";
        }
    }

    return (
        <div
            className={[
                "outline outline-1 hover:outline-gray-400 rounded-md",
                selectedComponentID == component.id
                    ? "outline-gray-400"
                    : "outline-transparent",
                ,
                isDragging ? "" : "duration-200",
            ].join(" ")}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(!showEdit ? listeners : {})}
            aria-describedby=""
            data-no-dnd="true"
        >
            <button
                ref={buttonRef}
                onClick={() => {
                    if (!isDragging) {
                        onSelected(component.id);
                    }
                }}
                className={`w-full p-4 ${selectedComponentID == component.id ? "pb-0" : ""}`}
            >
                <ImageWithFallback
                    src={fileToUrl(imageSrc)}
                    alt={""}
                    width={100}
                    height={100}
                    layout="responsive"
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                />
            </button>
            {showEdit && (
                <div className="flex gap-3 justify-end items-center  pb-4 pr-4">
                    <Button
                        variant="danger"
                        onClick={async () => {
                            onSelected("");
                            const sessionId = await getSessionCookie();
                            if (component.text) {
                                if (component.text != "/placeholder.webp") {
                                    const deleteOldImage = await deleteFile(
                                        component.text,
                                        sessionId ?? "",
                                    );
                                    if (!deleteOldImage.success) {
                                        //console.log(deleteOldImage.message);
                                    } else {
                                        onDelete(component.id);
                                    }
                                } else {
                                    onDelete(component.id);
                                }
                                //console.log("Not initail iamge");
                            }
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={() => {
                            onSelected("");
                            Cancel();
                        }}
                    >
                        Cancel
                    </Button>
                    <label
                        htmlFor={"image_" + component.id}
                        className="hover:brightness-90 bg-white text-black rounded-sm outline outline-1 outline-gray-300 px-3 py-1 cursor-pointer transition-all duration-150"
                        onClick={() => {
                            if (buttonRef.current) {
                                buttonRef.current.focus();
                            }
                        }}
                    >
                        Change Image
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            id={"image_" + component.id}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    //console.log(
                                    //     "File type:",
                                    //     e.target.files[0].type,
                                    // );
                                    setFileList(e.target.files);
                                    setImageSrc(
                                        URL.createObjectURL(e.target.files[0]),
                                    );
                                }
                            }}
                        />
                    </label>
                    <Button
                        onClick={async () => {
                            let newData = component;
                            let newImg = await changeImage();

                            onSelected("");
                            if (newImg) {
                                newData.text = newImg;
                                setImageSrc(newImg);
                            } else {
                                newData.text = "/placeholder.webp";
                                setImageSrc("/placeholder.webp");
                            }
                            onSave(newData);
                        }}
                        variant="primary"
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
}
