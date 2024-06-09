"use client";
import Button from "@/components/Button";
import { Component, fontWeights, paragraphFontSizes } from "@/types/content";
import React, { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ListComponent({
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
            handleCancel;
        }
    }, [selectedComponentID]);

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [currentComponent, setCurrentComponent] =
        useState<Component>(component);

    const handleCancel = () => {
        onSelected("");
        setCurrentComponent(component); // Reset to initial state
    };

    const handleSave = () => {
        onSelected("");
        component.text = currentComponent.text;
        component.rows = currentComponent.rows;
        onSave(currentComponent); // Notify parent component of changes
    };

    const handleRowChange = (index: number, value: string) => {
        const updatedRows = [...currentComponent.rows!]; // Ensure rows exist
        updatedRows[index] = value;

        setCurrentComponent((prevComponent) => ({
            ...prevComponent,
            rows: updatedRows,
        }));
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>,
        index: number,
    ) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default behavior of Enter key
            handleInsertRow(index + 1); // Insert a new row below the current one
        } else if (
            e.key === "Backspace" &&
            index > 0 &&
            !currentComponent.rows![index].trim()
        ) {
            // Check if backspace key is pressed, index is greater than 0, and the row content is empty
            handleDeleteRow(index);
        }
    };

    const handleInsertRow = (index: number) => {
        const updatedRows = [...currentComponent.rows!];
        updatedRows.splice(index, 0, ""); // Insert an empty row at the specified index
        setCurrentComponent((prevComponent) => ({
            ...prevComponent,
            rows: updatedRows,
        }));
        console.log(`row_${currentComponent.id}_${index}`);
        setTimeout(() => {
            const textArea = document.getElementById(
                `row_${currentComponent.id}_${index}`,
            );
            if (textArea) {
                textArea.focus();
            }
        }, 0);
    };

    const handleDeleteRow = (index: number) => {
        const updatedRows = [...currentComponent.rows!];
        updatedRows.splice(index, 1);
        setCurrentComponent((prevComponent) => ({
            ...prevComponent,
            rows: updatedRows,
        }));
        // Refocus to the last row after deletion, if there's at least one row left
        if (updatedRows.length > 0) {
            setTimeout(() => {
                const lastIndex = updatedRows.length - 1;
                const textArea = document.getElementById(
                    `row_${currentComponent.id}_${lastIndex}`,
                );
                if (textArea) {
                    textArea.focus();
                }
            }, 0);
        }
    };

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
            <div
                onClick={() => {
                    if (!isDragging) {
                        onSelected(component.id);
                    }
                }}
            >
                <ReactTextareaAutosize
                    spellCheck={false}
                    className={`${component.style && component.style.fontSize !== undefined ? paragraphFontSizes[component.style.fontSize].value : paragraphFontSizes[0].value} ${component.style && component.style.fontWeight !== undefined ? fontWeights[component.style.fontWeight].value : fontWeights[2].value}  w-full h-full resize-none focus:outline-none overflow-hidden bg-transparent`}
                    value={currentComponent.text}
                    onChange={(e) =>
                        setCurrentComponent((prevComponent) => ({
                            ...prevComponent,
                            text: e.target.value,
                        }))
                    }
                />
                <ul className="list-disc ml-6">
                    {currentComponent.rows?.map((row, i) => (
                        <li key={"row" + i}>
                            <div className="flex items-center">
                                <ReactTextareaAutosize
                                    spellCheck={false}
                                    id={`row_${currentComponent.id}_${i}`}
                                    className={`${component.style && component.style.fontSize !== undefined ? paragraphFontSizes[component.style.fontSize].value : paragraphFontSizes[0].value} ${component.style && component.style.fontWeight !== undefined ? fontWeights[component.style.fontWeight].value : fontWeights[2].value} w-full h-full resize-none focus:outline-none overflow-hidden bg-transparent`}
                                    value={row}
                                    onChange={(e) =>
                                        handleRowChange(i, e.target.value)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {showEdit && (
                <div className="flex gap-3 justify-end items-center">
                    <Button
                        variant="danger"
                        onClick={() => {
                            onSelected("");
                            onDelete(currentComponent.id);
                        }}
                    >
                        Delete
                    </Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave} variant="primary">
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
}
