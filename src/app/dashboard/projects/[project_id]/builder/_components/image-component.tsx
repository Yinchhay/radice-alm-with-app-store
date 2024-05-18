"use client";
import Image from "next/image";
import { Component } from "@/types/content";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

export default function ImageComponent({
    component,
    onSave,
    onDelete,
    onSelected,
    selectedComponentID,
}: {
    component: Component;
    onSave: (newData: Component) => void;
    onDelete: (ID: string) => void;
    onSelected: (ID: string) => void;
    selectedComponentID: string;
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
    const [imageSrc, setImageSrc] = useState<string>(
        component.text ? component.text : "/placeholder.webp",
    );
    const buttonRef = useRef<HTMLButtonElement>(null);

    function Cancel() {
        setImageSrc(component.text ? component.text : "/placeholder.webp");
    }
    useEffect(() => {
        if (isDragging) {
            onSelected("");
        }
    }, [isDragging]);

    useEffect(() => {
        if (selectedComponentID == component.id) {
            setShowEdit(true);
        } else {
            setShowEdit(false);
            Cancel();
        }
    }, [selectedComponentID]);

    return (
        <div
            className={[
                "outline outline-1 outline-transparent hover:outline-gray-400 p-4 rounded-md",
                selectedComponentID == component.id ? "outline-gray-400" : "",
                isDragging ? "" : "transition-all",
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
                className="w-full"
            >
                <Image
                    onError={() => setImageSrc("/placeholder.webp")}
                    src={imageSrc}
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
                <div className="flex gap-3 justify-end items-center">
                    <Button
                        variant="danger"
                        onClick={() => {
                            onSelected("");
                            onDelete(component.id);
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
                            onFocus={() => {
                                console.log("focus");
                            }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    console.log(
                                        "File type:",
                                        e.target.files[0].type,
                                    );
                                    setImageSrc(
                                        URL.createObjectURL(e.target.files[0]),
                                    );
                                }
                            }}
                        />
                    </label>
                    <Button
                        onClick={() => {
                            onSelected("");
                            let newData = component;
                            newData.text = imageSrc;
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
