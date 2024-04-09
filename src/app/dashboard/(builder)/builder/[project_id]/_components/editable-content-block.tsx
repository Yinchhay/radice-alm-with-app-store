"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { Component } from "@/types/content";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function EditableContentBlock({
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
    const textRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.value = component.text ? component.text : "";
        }
    }, []);

    function Cancel() {
        setShowEdit(false);
        switch (component.type) {
            case "heading":
                if (textRef.current) {
                    textRef.current.value = component.text
                        ? component.text
                        : "";
                }
                break;
        }
    }

    switch (component.type) {
        case "heading":
            return (
                <div>
                    <ReactTextareaAutosize
                        ref={textRef}
                        className="text-5xl font-extrabold text-center w-full h-full resize-none focus:outline-none"
                        onFocus={() => {
                            setShowEdit(true);
                        }}
                        onBlur={() => {
                            if (!isHovering) Cancel();
                        }}
                    />
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
                            <Button
                                onClick={() => {
                                    setShowEdit(false);
                                    if (onSave) {
                                        let newData = component;
                                        if (textRef.current) {
                                            newData.text =
                                                textRef.current.value;
                                        }
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
        case "image":
            return (
                <div>
                    <Image
                        src={
                            component.url ? component.url : "/placeholder.webp"
                        }
                        alt={""}
                        width={100}
                        height={100}
                        layout="responsive"
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                    <p className="text-center text-gray-600 italic mt-1">
                        {component.text}
                    </p>
                </div>
            );
        case "paragraph":
            return <p className="whitespace-pre-wrap">{component.text}</p>;
        case "list":
            return (
                <div>
                    <p>{component.text}</p>
                    <ul className="list-disc ml-6">
                        {component.rows?.map((row, i) => {
                            return <li key={"row" + i}>{row}</li>;
                        })}
                    </ul>
                </div>
            );
        default:
            return <div>Component does not exist</div>;
    }
}
