"use client";
import Button from "@/components/Button";
import { Component } from "@/types/content";
import { useState } from "react";
import EditableContentBlock from "./_components/editable-content-block";
import HeadingComponent from "./_components/heading-component";
import ImageComponent from "./_components/image-component";
import ParagraphComponent from "./_components/paragraph-component";
import ListComponent from "./_components/list-component";

export default function ProjectBuilderPage() {
    const [content, setContent] = useState<Component[]>([
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

    function SaveComponent(newData: Component) {
        setContent((prevContent) => {
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
        setContent((prevContent) =>
            prevContent.filter((component) => component.id !== ID),
        );
    }

    return (
        <div className="grid grid-cols-8 pb-8">
            <div>Chapter Component</div>
            <div className="col-span-6">
                <div className="w-full max-w-[1000px] mx-auto">
                    <h1 className="text-lg font-bold">Content</h1>
                    <ul className="grid gap-4">
                        {content.map((component, i) => {
                            let componentBlock;
                            switch (component.type) {
                                case "heading":
                                    componentBlock = (
                                        <HeadingComponent
                                            component={component}
                                            onSave={(newData) => {
                                                SaveComponent(newData);
                                            }}
                                            onDelete={(ID) => {
                                                DeleteComponent(ID);
                                            }}
                                        />
                                    );
                                    break;
                                case "image":
                                    componentBlock = (
                                        <ImageComponent
                                            component={component}
                                            onSave={(newData) => {
                                                let newComponents = content;
                                                newComponents[i] = newData;
                                                console.log(newComponents);
                                                setContent(newComponents);
                                            }}
                                            onDelete={(ID) => {
                                                setContent((prevContent) =>
                                                    prevContent.filter(
                                                        (component) =>
                                                            component.id !== ID,
                                                    ),
                                                );
                                            }}
                                        />
                                    );
                                    break;
                                case "paragraph":
                                    componentBlock = (
                                        <ParagraphComponent
                                            component={component}
                                            onSave={(newData) => {
                                                let newComponents = content;
                                                newComponents[i] = newData;
                                                console.log(newComponents);
                                                setContent(newComponents);
                                            }}
                                            onDelete={(ID) => {
                                                setContent((prevContent) =>
                                                    prevContent.filter(
                                                        (component) =>
                                                            component.id !== ID,
                                                    ),
                                                );
                                            }}
                                        />
                                    );
                                    break;
                                case "list":
                                    componentBlock = (
                                        <ListComponent
                                            component={component}
                                            onSave={(newData) => {
                                                let newComponents = content;
                                                newComponents[i] = newData;
                                                console.log(newComponents);
                                                setContent(newComponents);
                                            }}
                                            onDelete={(ID) => {
                                                setContent((prevContent) =>
                                                    prevContent.filter(
                                                        (component) =>
                                                            component.id !== ID,
                                                    ),
                                                );
                                            }}
                                        />
                                    );
                                    break;
                                default:
                                    componentBlock = (
                                        <div className="bg-red-500 text-white p-1">
                                            This component type does not exist
                                        </div>
                                    );
                            }
                            return <li key={component.id}>{componentBlock}</li>;
                        })}
                    </ul>
                </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-300 m-4 bg-gray-100">
                <h1 className="font-bold text-lg">Components</h1>
                <ul className="grid grid-cols-3 gap-4 mt-2">
                    <Button
                        square={true}
                        className="w-12 font-bold bg-white text-lg"
                        onClick={() => {
                            setContent((prevContent) => [
                                ...prevContent,
                                {
                                    id: (prevContent.length + 1).toString(), // Generate a unique ID
                                    type: "heading",
                                    text: "Heading Text", // Add default text or leave empty
                                },
                            ]);
                        }}
                    >
                        H
                    </Button>
                    <Button
                        square={true}
                        className="w-12 font-bold bg-white text-lg"
                        onClick={() => {
                            setContent((prevContent) => [
                                ...prevContent,
                                {
                                    id: (prevContent.length + 1).toString(),
                                    type: "image",
                                    text: "/placeholder.webp", // Add default image URL or leave empty
                                },
                            ]);
                        }}
                    >
                        I
                    </Button>
                    <Button
                        square={true}
                        className="w-12 font-bold bg-white text-lg"
                        onClick={() => {
                            setContent((prevContent) => [
                                ...prevContent,
                                {
                                    id: (prevContent.length + 1).toString(),
                                    type: "paragraph",
                                    text: "Paragraph...", // Add default paragraph text or leave empty
                                },
                            ]);
                        }}
                    >
                        P
                    </Button>
                    <Button
                        square={true}
                        className="w-12 font-bold bg-white text-lg"
                        onClick={() => {
                            setContent((prevContent) => [
                                ...prevContent,
                                {
                                    id: (prevContent.length + 1).toString(),
                                    type: "list",
                                    text: "List", // Add default list text or leave empty
                                    rows: ["Row"], // Add default list items or leave empty
                                },
                            ]);
                        }}
                    >
                        L
                    </Button>
                </ul>
            </div>
        </div>
    );
}
