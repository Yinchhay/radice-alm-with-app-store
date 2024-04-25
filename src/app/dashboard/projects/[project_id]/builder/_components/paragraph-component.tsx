"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { Component } from "@/types/content";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ParagraphComponent({
    component,
    onSave,
    onDelete,
}: {
    component: Component;
    onSave?: (newData: Component) => void;
    onDelete?: (ID: string) => void;
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
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const textRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.value = component.text ? component.text : "";
        }
    }, []);

    function Cancel() {
        setShowEdit(false);
        if (textRef.current) {
            textRef.current.value = component.text ? component.text : "";
        }
    }

    useEffect(() => {
        if (isDragging) {
            setShowEdit(false);
        }
    }, [isDragging]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(!showEdit ? listeners : {})}
            aria-describedby=""
            data-no-dnd="true"
            className="hover:outline hover:outline-1 hover:outline-gray-400 p-4 rounded-md focus-within:outline focus-within:outline-1 focus-within:outline-gray-400"
        >
            <ReactTextareaAutosize
                ref={textRef}
                className="w-full h-full resize-none focus:outline-none overflow-hidden bg-transparent"
                onClick={() => {
                    if (!isDragging) {
                        setShowEdit(true);
                    }
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
                                    newData.text = textRef.current.value;
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
}
