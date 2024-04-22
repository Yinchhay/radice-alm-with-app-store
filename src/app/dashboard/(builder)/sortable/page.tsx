"use client";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { SortableItem } from "./item";

export default function SortablePage() {
    const [items] = useState([1, 2, 3]);

    return (
        <DndContext>
            <SortableContext items={items}>
                {items.map((item) => {
                    return <SortableItem key={item} id={item} />;
                })}
            </SortableContext>
        </DndContext>
    );
}
