"use client";
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    closestCorners,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { ErrorComponent } from "./_components/error-component";
import { Component } from "@/types/content";
import { parse } from "path";
import ImageComponent from "./_components/image-component";
import ParagraphComponent from "./_components/paragraph-component";
import ListComponent from "./_components/list-component";
import HeadingComponent from "./_components/heading-component";
import ComponentAdder from "./_components/component-adder";
import { v4 } from "uuid";
import {
    fetchEditProjectContentbyId,
    fetchOneAssociatedProject,
} from "./fetch";
import { useParams } from "next/navigation";

export default function Builder() {
    const params = useParams<{ project_id: string }>();
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, keyboardSensor);
    const [components, setComponents] = useState<Component[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<string>("");

    useEffect(() => {
        async function loadProjectData() {
            const result = await fetchOneAssociatedProject(params.project_id);
            if (result.success) {
                console.log(result.data);
                if (result.data.project) {
                    if (result.data.project.projectContent) {
                        setDataLoaded(true);
                        setComponents(
                            JSON.parse(result.data.project.projectContent as string),
                        );
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
        async function updateProjectContent() {
            const result = await fetchEditProjectContentbyId(
                params.project_id,
                components,
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
    }, [components]);

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
        const newComponent = generateComponent("heading", "New Heading");
        setComponents((prevComponents) => [...prevComponents, newComponent]);
        setLastComponentId(newComponent.id); // Set last component ID
        setInitializing(false); // Component initialization is complete
    };

    // Function to add an image component
    const addImage = () => {
        const newComponent = generateComponent("image", "/placeholder.webp");
        setComponents((prevComponents) => [...prevComponents, newComponent]);
        setLastComponentId(newComponent.id); // Set last component ID
        setInitializing(false); // Component initialization is complete
    };

    // Function to add a list component
    const addList = () => {
        const newComponent = generateComponent("list", "Listing");
        setComponents((prevComponents) => [...prevComponents, newComponent]);
        setLastComponentId(newComponent.id); // Set last component ID
        setInitializing(false); // Component initialization is complete
    };

    // Function to add a paragraph component
    const addParagraph = () => {
        const newComponent = generateComponent("paragraph", "New paragraph");
        setComponents((prevComponents) => [...prevComponents, newComponent]);
        setLastComponentId(newComponent.id); // Set last component ID
        setInitializing(false); // Component initialization is complete
    };
    return (
        <div className="relative">
            <ComponentAdder
                onAddHeading={addHeading}
                onAddImage={addImage}
                onAddList={addList}
                onAddParagraph={addParagraph}
            />
            <div className="w-full max-w-[700px] mx-auto bg-transparent z-10 relative">
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
                                                    setSelectedComponent(id);
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
                                                selectedComponentID={
                                                    selectedComponent
                                                }
                                                onSelected={(id) => {
                                                    console.log("Selected");
                                                    setSelectedComponent(id);
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
                                                    setSelectedComponent(id);
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
                                                    setSelectedComponent(id);
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
            <div
                className="w-screen h-screen  fixed top-0 left-0 z-0"
                onClick={() => setSelectedComponent("")}
            ></div>
        </div>
    );
}
