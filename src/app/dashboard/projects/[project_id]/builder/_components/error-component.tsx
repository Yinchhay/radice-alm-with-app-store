"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Component } from "@/types/content";

export function ErrorComponent({ component }: { component: Component }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: component.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            aria-describedby=""
        >
            {component.type + " is not a component type"}{" "}
            {/* Render the content of the sortable item */}
        </li>
    );
}
