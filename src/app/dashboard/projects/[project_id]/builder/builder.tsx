"use client";
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { ErrorComponent } from "./_components/error-component";
import { Chapter, Component } from "@/types/content";
import { parse } from "path";
import ImageComponent from "./_components/image-component";
import ParagraphComponent from "./_components/paragraph-component";
import ListComponent from "./_components/list-component";
import HeadingComponent from "./_components/heading-component";
import ComponentAdder from "./_components/component-adder";
import { v4 } from "uuid";
import {
    fetchEditProjectContentById,
    fetchOneAssociatedProject,
} from "./fetch";
import { useParams } from "next/navigation";
import ComponentStyler from "./_components/component-styler";
import ChapterManager from "./_components/chapter-manage";
import Overlay from "@/components/Overlay";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    weight: ["300", "400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function Builder() {
    const params = useParams<{ project_id: string }>();
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, keyboardSensor);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [showCreateOverlay, setShowCreateOverlay] = useState(false);
    const defaultChapterName = "New Chapter";
    const [newChapterName, setNewChapterName] = useState(defaultChapterName);
    const [errorMessage, setErrorMessage] = useState("");

    function deleteChapter(ID: string) {
        if (selectedChapter !== null) {
            if (selectedChapter <= 0) {
                setComponents([]);
                setSelectedChapter(null);
            } else {
                setSelectedChapter(0);
                setComponents(chapters[0].components);
            }
        }
        setChapters((prevContent) =>
            prevContent.filter((chapter) => chapter.id !== ID),
        );
    }

    function editChapterName(ID: string, chapterName: string) {
        setChapters((prevContent) =>
            prevContent.map((chapter) =>
                chapter.id === ID ? { ...chapter, name: chapterName } : chapter,
            ),
        );
    }

    function addChapter() {
        let newChapter: Chapter = {
            id: v4(),
            name: newChapterName,
            components: [],
        };
        setChapters((prevChapters) => [...prevChapters, newChapter]);
        if (chapters.length == 0) {
            setSelectedChapter(0);
        }
        setNewChapterName(defaultChapterName);
        setErrorMessage("");
    }

    function findComponentById(
        components: Component[],
        selectedId: string,
    ): Component | null {
        for (const component of components) {
            if (component.id === selectedId) {
                return component;
            }
        }
        return null;
    }

    useEffect(() => {
        async function loadProjectData() {
            const result = await fetchOneAssociatedProject(params.project_id);
            if (result.success) {
                console.log(result.data);
                if (result.data.project) {
                    if (result.data.project.projectContent) {
                        setDataLoaded(true);
                        if (result.data.project.projectContent) {
                            try {
                                setChapters(
                                    JSON.parse(
                                        result.data.project
                                            .projectContent as string,
                                    ),
                                );
                                setSelectedChapter(0);
                            } catch {
                                setChapters([]);
                            }
                        }
                    } else {
                        setDataLoaded(true);
                    }
                }
            } else {
                console.log(result.errors);
            }
        }
        if (!dataLoaded) {
            loadProjectData();
        }
    }, []);

    useEffect(() => {
        if (chapters.length > 0 && selectedChapter !== null) {
            setComponents(chapters[selectedChapter].components);
        }
    }, [selectedChapter]);

    useEffect(() => {
        async function updateProjectContent() {
            const result = await fetchEditProjectContentById(
                params.project_id,
                chapters,
            );
            if (result.success) {
                console.log(result.data);
            } else {
                console.log(result.errors);
            }
        }
        if (dataLoaded) {
            updateProjectContent();
        }
    }, [chapters]);

    useEffect(() => {
        setChapters((prevChapters) => {
            return prevChapters.map((chapter, i) => {
                if (i == selectedChapter) {
                    chapter.components = components;
                }
                return chapter;
            });
        });
    }, [components]);

    function reOrderChapterList(e: DragEndEvent) {
        if (e.over) {
            if (e.active.id != e.over.id) {
                const oldIndex = chapters.findIndex(
                    (chapter) => chapter.id === e.active.id,
                );
                const newIndex = chapters.findIndex(
                    (chapter) => chapter.id === e.over?.id,
                );
                setChapters(arrayMove(chapters, oldIndex, newIndex));
                setSelectedChapter(newIndex);
            }
        }
    }

    function reOrderComponentList(e: DragEndEvent) {
        if (e.over) {
            if (e.active.id != e.over.id) {
                const oldIndex = components.findIndex(
                    (component) => component.id === e.active.id,
                );
                const newIndex = components.findIndex(
                    (component) => component.id === e.over?.id,
                );
                setComponents(arrayMove(components, oldIndex, newIndex));
            }
        }
    }

    function SaveComponent(newData: Component) {
        setComponents((prevContent) => {
            return prevContent.map((component) => {
                if (component.id === newData.id) {
                    return newData;
                } else {
                    return component;
                }
            });
        });
    }

    function DeleteComponent(ID: string) {
        setComponents((prevContent) =>
            prevContent.filter((component) => component.id !== ID),
        );
    }

    // Function to generate a new component
    const generateComponent = (type: string, text: string = ""): Component => ({
        id: v4(), // Generate unique ID
        type,
        text,
        // Default values for specific types if needed
        rows: type === "list" ? ["Item"] : undefined,
    });

    const [lastComponentId, setLastComponentId] = useState<string | null>(null);
    const lastComponentRef = useRef<HTMLDivElement>(null);

    // State to track whether the component is being initialized
    const [initializing, setInitializing] = useState<boolean>(true);

    useEffect(() => {
        if (!initializing && lastComponentId && lastComponentRef.current) {
            lastComponentRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            setLastComponentId(null); // Reset last component ID
        }
    }, [lastComponentId, initializing]); // Trigger effect when last component ID or initializing state changes

    // Function to add a heading component
    const addHeading = () => {
        if (chapters.length > 0) {
            const newComponent = generateComponent("heading", "New Heading");
            setComponents((prevComponents) => [
                ...prevComponents,
                newComponent,
            ]);
            setLastComponentId(newComponent.id); // Set last component ID
            setSelectedComponent(newComponent.id);
            setInitializing(false); // Component initialization is complete
        }
    };

    // Function to add an image component
    const addImage = () => {
        if (chapters.length > 0) {
            const newComponent = generateComponent(
                "image",
                "/placeholder.webp",
            );
            setComponents((prevComponents) => [
                ...prevComponents,
                newComponent,
            ]);
            setLastComponentId(newComponent.id); // Set last component ID
            setSelectedComponent(newComponent.id);
            setInitializing(false); // Component initialization is complete
        }
    };

    // Function to add a list component
    const addList = () => {
        if (chapters.length > 0) {
            const newComponent = generateComponent("list", "Listing");
            setComponents((prevComponents) => [
                ...prevComponents,
                newComponent,
            ]);
            setLastComponentId(newComponent.id); // Set last component ID
            setSelectedComponent(newComponent.id);
            setInitializing(false); // Component initialization is complete
        }
    };

    // Function to add a paragraph component
    const addParagraph = () => {
        if (chapters.length > 0) {
            const newComponent = generateComponent(
                "paragraph",
                "New paragraph",
            );
            setComponents((prevComponents) => [
                ...prevComponents,
                newComponent,
            ]);
            setLastComponentId(newComponent.id); // Set last component ID
            setSelectedComponent(newComponent.id);
            setInitializing(false); // Component initialization is complete
        }
    };
    return (
        <div className="relative grid grid-cols-[270px_minmax(auto,920px)_270px] w-full max-w-[1500px] mx-auto">
            {showCreateOverlay && (
                <Overlay
                    onClose={() => {
                        setNewChapterName(defaultChapterName);
                        setErrorMessage("");
                        setShowCreateOverlay(false);
                    }}
                >
                    <Card className="w-[300px]">
                        <form>
                            <h1 className="text-2xl font-bold capitalize text-center">
                                Create Chapter
                            </h1>
                            <h2 className="mt-4 mb-1 font-bold">
                                Chapter Name
                            </h2>
                            <InputField
                                defaultValue={newChapterName}
                                onChange={(e) => {
                                    setNewChapterName(e.target.value);
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
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setNewChapterName(defaultChapterName);
                                        setErrorMessage("");
                                        setShowCreateOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        const trimmedChapterName =
                                            newChapterName.trim();
                                        if (trimmedChapterName.length == 0) {
                                            setErrorMessage(
                                                "Chapter name must not be empty",
                                            );
                                        } else if (
                                            trimmedChapterName.length >= 100
                                        ) {
                                            setErrorMessage(
                                                "Chapter name must not be longer than 100 characters",
                                            );
                                        } else {
                                            addChapter();
                                            setShowCreateOverlay(false);
                                        }
                                    }}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
            <div className="grid gap-2 w-full z-10 relative h-fit">
                <div className="absolute ">
                    <div className="fixed w-[270px]">
                        <ChapterManager
                            onEditChapterName={(chapterID, chapterName) =>
                                editChapterName(chapterID, chapterName)
                            }
                            selectedChapter={selectedChapter}
                            chapters={chapters}
                            selectChapterIndex={(index) => {
                                setSelectedComponent("");
                                setSelectedChapter(index);
                            }}
                            onCreateChapter={() => setShowCreateOverlay(true)}
                            onDeleteChapter={(chapterID) =>
                                deleteChapter(chapterID)
                            }
                            moveChapters={(e) => reOrderChapterList(e)}
                        />
                    </div>
                </div>
            </div>

            <div className="z-[5] relative bg-transparent">
                <div className="w-full px-4">
                    <DndContext
                        sensors={sensors}
                        onDragEnd={(e) => {
                            reOrderComponentList(e);
                        }}
                    >
                        <SortableContext items={components}>
                            {components.map((component, i) => {
                                let componentBlock;
                                switch (component.type) {
                                    case "heading":
                                        componentBlock = (
                                            <div
                                                key={component.id}
                                                ref={
                                                    i === components.length - 1
                                                        ? lastComponentRef
                                                        : undefined
                                                }
                                            >
                                                <HeadingComponent
                                                    selectedComponentID={
                                                        selectedComponent
                                                    }
                                                    onSelected={(id) => {
                                                        console.log("Selected");
                                                        setSelectedComponent(
                                                            id,
                                                        );
                                                    }}
                                                    component={component}
                                                    onSave={(newData) => {
                                                        SaveComponent(newData);
                                                    }}
                                                    onDelete={(ID) => {
                                                        DeleteComponent(ID);
                                                    }}
                                                />
                                            </div>
                                        );
                                        break;
                                    case "image":
                                        componentBlock = (
                                            <div
                                                key={component.id}
                                                ref={
                                                    i === components.length - 1
                                                        ? lastComponentRef
                                                        : undefined
                                                }
                                            >
                                                <ImageComponent
                                                    projectId={
                                                        params.project_id
                                                    }
                                                    selectedComponentID={
                                                        selectedComponent
                                                    }
                                                    onSelected={(id) => {
                                                        console.log("Selected");
                                                        setSelectedComponent(
                                                            id,
                                                        );
                                                    }}
                                                    component={component}
                                                    onSave={(newData) => {
                                                        SaveComponent(newData);
                                                    }}
                                                    onDelete={(ID) => {
                                                        DeleteComponent(ID);
                                                    }}
                                                />
                                            </div>
                                        );
                                        break;
                                    case "paragraph":
                                        componentBlock = (
                                            <div
                                                key={component.id}
                                                ref={
                                                    i === components.length - 1
                                                        ? lastComponentRef
                                                        : undefined
                                                }
                                            >
                                                <ParagraphComponent
                                                    selectedComponentID={
                                                        selectedComponent
                                                    }
                                                    onSelected={(id) => {
                                                        console.log("Selected");
                                                        setSelectedComponent(
                                                            id,
                                                        );
                                                    }}
                                                    component={component}
                                                    onSave={(newData) => {
                                                        SaveComponent(newData);
                                                    }}
                                                    onDelete={(ID) => {
                                                        DeleteComponent(ID);
                                                    }}
                                                />
                                            </div>
                                        );
                                        break;
                                    case "list":
                                        componentBlock = (
                                            <div
                                                key={component.id}
                                                ref={
                                                    i === components.length - 1
                                                        ? lastComponentRef
                                                        : undefined
                                                }
                                            >
                                                <ListComponent
                                                    selectedComponentID={
                                                        selectedComponent
                                                    }
                                                    onSelected={(id) => {
                                                        console.log("Selected");
                                                        setSelectedComponent(
                                                            id,
                                                        );
                                                    }}
                                                    component={component}
                                                    onSave={(newData) => {
                                                        SaveComponent(newData);
                                                    }}
                                                    onDelete={(ID) => {
                                                        DeleteComponent(ID);
                                                    }}
                                                />
                                            </div>
                                        );
                                        break;
                                    default:
                                        componentBlock = (
                                            <ErrorComponent
                                                component={component}
                                                key={component.id}
                                            />
                                        );
                                }
                                return componentBlock;
                            })}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
            <div className="w-full z-10 relative h-fit">
                <div className="absolute">
                    <div className="fixed w-[270px]">
                        <div className="grid gap-4">
                            <ComponentAdder
                                onAddHeading={addHeading}
                                onAddImage={addImage}
                                onAddList={addList}
                                onAddParagraph={addParagraph}
                            />
                            <ComponentStyler
                                selectedComponent={findComponentById(
                                    components,
                                    selectedComponent,
                                )}
                                onStyleChange={(newData) => {
                                    SaveComponent(newData);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="w-screen h-screen fixed top-0 left-0 z-0"
                onClick={() => setSelectedComponent("")}
            ></div>
        </div>
    );
}
