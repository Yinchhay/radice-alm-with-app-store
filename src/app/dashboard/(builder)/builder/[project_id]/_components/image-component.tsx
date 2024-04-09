"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { Component } from "@/types/content";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function ImageComponent({
    component,
    onSave,
    onDelete,
}: {
    component: Component;
    onSave?: (newData: Component) => void;
    onDelete?: (ID: string) => void;
}) {
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string>(
        component.text ? component.text : "/placeholder.webp",
    );
    const buttonRef = useRef<HTMLButtonElement>(null);

    function Cancel() {
        setShowEdit(false);
        setImageSrc(component.text ? component.text : "/placeholder.webp");
    }

    return (
        <div>
            <button
                ref={buttonRef}
                onFocus={() => {
                    setShowEdit(true);
                }}
                onBlur={() => {
                    if (!isHovering) Cancel();
                }}
                className="w-full"
            >
                <Image
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
                <div
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="flex gap-3 justify-end items-center"
                >
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowEdit(false);
                            if (onDelete) {
                                onDelete(component.id);
                            }
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={() => {
                            Cancel();
                        }}
                    >
                        Cancel
                    </Button>
                    <label
                        htmlFor={"image_" + component.id}
                        className="hover:brightness-90 bg-gray-100 text-black rounded-md outline outline-1 outline-gray-300 px-3 py-1 cursor-pointer transition-all duration-150"
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
                            setShowEdit(false);
                            if (onSave) {
                                let newData = component;
                                newData.text = imageSrc;
                                onSave(newData);
                            }
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
