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
    selectChapterID,
    onEditChapterName,
    moveChapters,
    selectedChapter,
}: {
    chapters: Chapter[];
    selectChapterID: (chapterID: string) => void;
    onCreateChapter: () => void;
    onDeleteChapter: (chapterID: string) => void;
    onEditChapterName: (chapterID: string, chapterName: string) => void;
    moveChapters: (e: DragEndEvent) => void;
    selectedChapter: string;
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
                                        selectedChapter !== "" &&
                                        chapter.id == selectedChapter
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
                                        if (selectedChapter == "") {
                                            selectChapterID(chapter.id);
                                        } else if (
                                            selectedChapter != chapter.id
                                        ) {
                                            selectChapterID(chapter.id);
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
