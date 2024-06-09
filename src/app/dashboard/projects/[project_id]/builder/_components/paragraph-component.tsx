"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import {
    Component,
    fontAligns,
    fontWeights,
    paragraphFontSizes,
} from "@/types/content";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ParagraphComponent({
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
    const textRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.value = component.text ? component.text : "";
        }
    }, []);

    function Cancel() {
        if (textRef.current) {
            textRef.current.value = component.text ? component.text : "";
        }
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
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(!showEdit ? listeners : {})}
            aria-describedby=""
            data-no-dnd="true"
            className={[
                "outline outline-1 outline-transparent hover:outline-gray-400 p-4 rounded-md",
                selectedComponentID == component.id ? "outline-gray-400" : "",
                isDragging ? "" : "duration-200",
            ].join(" ")}
        >
            <ReactTextareaAutosize
                spellCheck={false}
                ref={textRef}
                className={`${component.style && component.style.fontSize !== undefined ? paragraphFontSizes[component.style.fontSize].value : paragraphFontSizes[0].value} ${component.style && component.style.fontWeight !== undefined ? fontWeights[component.style.fontWeight].value : fontWeights[1].value} ${component.style && component.style.fontAlign !== undefined ? fontAligns[component.style.fontAlign].value : fontAligns[0].value} w-full h-full resize-none focus:outline-none overflow-hidden bg-transparent`}
                onClick={() => {
                    if (!isDragging) {
                        onSelected(component.id);
                    }
                }}
            />
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
                    <Button
                        onClick={() => {
                            onSelected("");
                            let newData = component;
                            if (textRef.current) {
                                newData.text = textRef.current.value;
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
