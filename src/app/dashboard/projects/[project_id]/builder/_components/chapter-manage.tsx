"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Chapter } from "@/types/content";
import { IconPlus } from "@tabler/icons-react";
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import ChapterComponent from "./chapter-component";
import { useEffect } from "react";
import Tooltip from "@/components/Tooltip";

export default function ChapterManager({
    chapters,
    onCreateChapter,
    onDeleteChapter,
    selectChapterIndex,
    onEditChapterName,
    moveChapters,
    selectedChapter,
}: {
    chapters: Chapter[];
    selectChapterIndex: (index: number) => void;
    onCreateChapter: () => void;
    onDeleteChapter: (chapterID: string) => void;
    onEditChapterName: (chapterID: string, chapterName: string) => void;
    moveChapters: (e: DragEndEvent) => void;
    selectedChapter: number | null;
}) {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, keyboardSensor);

    return (
        <Card>
            <div className="flex justify-between items-end mb-2">
                <h1 className="font-bold text-lg">Chapters</h1>
                <div>
                    <Tooltip title="Create Chapter" position="right">
                        <Button
                            variant="primary"
                            square={true}
                            onClick={onCreateChapter}
                        >
                            <IconPlus></IconPlus>
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="grid gap-2">
                <DndContext
                    sensors={sensors}
                    onDragEnd={(e) => {
                        moveChapters(e);
                    }}
                >
                    <SortableContext items={chapters}>
                        {chapters.map((chapter, i) => {
                            return (
                                <ChapterComponent
                                    selected={
                                        selectedChapter !== null &&
                                        chapter.id ==
                                            chapters[selectedChapter].id
                                            ? true
                                            : false
                                    }
                                    onDelete={(chapterID) =>
                                        onDeleteChapter(chapterID)
                                    }
                                    onEdit={(chapterName) =>
                                        onEditChapterName(
                                            chapter.id,
                                            chapterName,
                                        )
                                    }
                                    chapter={chapter}
                                    key={`${chapter.id}-chapter`}
                                    onClick={() => {
                                        if (selectedChapter == null) {
                                            selectChapterIndex(i);
                                        } else if (selectedChapter != i) {
                                            selectChapterIndex(i);
                                        }
                                    }}
                                />
                            );
                        })}
                    </SortableContext>
                </DndContext>
            </div>
        </Card>
    );
}
