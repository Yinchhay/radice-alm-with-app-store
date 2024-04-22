"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ id }: { id: number }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {id} {/* Render the content of the sortable item */}
        </li>
    );
}
