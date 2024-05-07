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

export default function ProjectBuilderPage() {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, keyboardSensor);
    const [components, setComponents] = useState<Component[]>([
        {
            id: "1",
            type: "heading",
            text: "Mobile Legends Revenue Passes $500 Million as Southeast Asia Powers Explosive Growth",
        },
        {
            id: "2",
            type: "image",
            text: "https://images.ctfassets.net/vfkpgemp7ek3/353425681/dd78845e8603855fa22276f8bcbee5c2/mobile-legends-generates-500-million-usd.jpg?fm=webp&q=40&w=1920",
        },
        {
            id: "3",
            type: "paragraph",
            text: "Mobile Legends: Bang Bang from Moonton experienced explosive growth over the last year to power lifetime gross revenue past $502.5 million, according to Sensor Tower Store Intelligence estimates.\n\nLaunched in 2016, the popular mobile MOBA has seen its user spending increase every year, peaking at $214.1 million in 2019, up 36 percent year-over-year. The game had its best month ever in December 2019, generating $24.4 million, spurred on by the release of version 2.0 of the title.\n\nLMuch of the game’s stellar revenue performance stems from Asia, particularly Southeast Asia, where the title has generated $307 million, or 61 percent of total revenue, since launch. Excluding China, where Mobile Legends is not available, Moonton’s hit is the top grossing MOBA in Asia. It’s even ahead of Tencent’s blockbuster Honor of Kings, which has picked up $251.4 million in the region outside of the Chinese market.",
        },
        {
            id: "4",
            type: "image",
            text: "https://images.ctfassets.net/vfkpgemp7ek3/345807428/8cf704071aa418358b127cd6fa115318/mobile-legends-global-user-spending-by-year.jpg?fm=webp&q=40&w=1920",
        },
        {
            id: "5",
            type: "list",
            text: "Much of the game’s stellar revenue performance stems from Asia, particularly Southeast Asia, where the title has generated $307 million, or 61 percent of total revenue, since launch:",
            rows: [
                "Malaysia has proven to be Mobile Legends’ most lucrative market, with players there spending $87.5 million in the game, or 17 percent of total revenue.",
                "Indonesia ranked No. 2 for player spending, generating $69.2 million, or 14 percent of the total",
                "United States was No. 3, racking up $64.1 million, or 12.8 percent of all revenue.",
            ],
        },
    ]);

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
        rows: type === "list" ? [] : undefined,
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
        const newComponent = generateComponent("list");
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
            <div className="w-full max-w-[1000px] mx-auto">
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
    );
}
