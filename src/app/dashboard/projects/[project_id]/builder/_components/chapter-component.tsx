import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import Tooltip from "@/components/Tooltip";
import { Chapter } from "@/types/content";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

export default function ChapterComponent({
    chapter,
    onClick,
    onDelete,
    onEdit,
    selected,
}: {
    chapter: Chapter;
    onClick: () => void;
    onDelete: (chapterID: string) => void;
    onEdit: (chapterName: string) => void;
    selected: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: chapter.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [showEditOverlay, setShowEditOverlay] = useState(false);
    const [newName, setNewName] = useState(chapter.name);
    const [errorMessage, setErrorMessage] = useState("");
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(!showEditOverlay && !showDeleteOverlay ? listeners : {})}
            aria-describedby=""
            data-no-dnd="true"
            onClick={onClick}
        >
            <div
                className={`flex items-center justify-between dark:bg-gray-700 dark:border-gray-600 border rounded-sm ${selected ? "bg-gray-100 border-gray-300" : "border-gray-300 bg-white"} p-2 transition-all h-[46px] hover:bg-gray-100 hover:border-gray-300`}
            >
                {showDeleteOverlay && (
                    <Overlay
                        onClose={() => {
                            setShowDeleteOverlay(false);
                        }}
                    >
                        <Card className="w-[300px]">
                            <h1 className="text-2xl font-bold capitalize text-center">
                                Delete Chapter
                            </h1>
                            <h2 className="text-center mt-4 mb-6">
                                "{chapter.name}"
                            </h2>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => onDelete(chapter.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    </Overlay>
                )}
                {showEditOverlay && (
                    <Overlay
                        onClose={() => {
                            setErrorMessage("");
                            setNewName(chapter.name);
                            setShowEditOverlay(false);
                        }}
                    >
                        <Card className="w-[300px]">
                            <h1 className="text-2xl font-bold capitalize text-center">
                                Edit Chapter Name
                            </h1>
                            <h2 className="mt-4 mb-1 font-bold">
                                Chapter Name
                            </h2>
                            <InputField
                                defaultValue={newName}
                                onChange={(e) => {
                                    setNewName(e.target.value);
                                }}
                            />
                            {errorMessage.length > 0 && (
                                <div className="my-2 py-1 px-3 rounded-sm bg-red-100 ">
                                    <p className="text-red-500">
                                        {errorMessage}
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setErrorMessage("");
                                        setNewName(chapter.name);
                                        setShowEditOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        if (newName.length == 0) {
                                            setErrorMessage(
                                                "Chapter name must not be empty",
                                            );
                                        } else if (newName.length >= 100) {
                                            setErrorMessage(
                                                "Chapter name must not be longer than 100 characters",
                                            );
                                        } else {
                                            onEdit(newName.trim());
                                            setErrorMessage("");
                                            setNewName(newName.trim());
                                            setShowEditOverlay(false);
                                        }
                                    }}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </Card>
                    </Overlay>
                )}
                <Tooltip title={chapter.name} position="bottom">
                    <h1 className="flex-shrink-0 max-w-[150px] text-ellipsis truncate">
                        {chapter.name}
                    </h1>
                </Tooltip>
                {selected && (
                    <div className="flex-shrink-0 flex gap-2">
                        <Tooltip title="Edit" position="bottom">
                            <Button square>
                                <IconEdit
                                    size={20}
                                    onClick={() => setShowEditOverlay(true)}
                                />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete" position="bottom">
                            <Button
                                square
                                onClick={() => setShowDeleteOverlay(true)}
                                variant="danger"
                            >
                                <IconTrash size={20} />
                            </Button>
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
}
