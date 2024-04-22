import Button from "@/components/Button";
import { Component } from "@/types/content";
import React, { useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ListComponent({
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
    const [currentComponent, setCurrentComponent] =
        useState<Component>(component);

    const handleCancel = () => {
        setShowEdit(false);
        setCurrentComponent(component); // Reset to initial state
    };

    const handleSave = () => {
        setShowEdit(false);
        component.text = currentComponent.text;
        component.rows = currentComponent.rows;
        onSave && onSave(currentComponent); // Notify parent component of changes
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
        setIsHovering(true);
        setTimeout(() => {
            const textArea = document.getElementById(
                `row_${currentComponent.id}_${index}`,
            );
            if (textArea) {
                textArea.focus();
                setIsHovering(false); // Focus on the newly inserted row
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
    };

    return (
        <div
            onFocus={() => setShowEdit(true)}
            onBlur={() => {
                if (!isHovering) handleCancel();
            }}
            className="hover:bg-gray-200 p-4 rounded-lg"
        >
            <ReactTextareaAutosize
                className="w-full h-full resize-none focus:outline-none overflow-hidden"
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
                                id={`row_${currentComponent.id}_${i}`}
                                className="w-full h-full resize-none focus:outline-none overflow-hidden"
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
                            onDelete && onDelete(currentComponent.id);
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
