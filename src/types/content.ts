import { DropdownElement } from "@/components/Dropdown";

export interface Component {
    id: string;
    type: string;
    text?: string;
    url?: string;
    rows?: string[];
    style?: {
        fontSize?: number;
        fontWeight?: number;
        fontAlign?: number;
    };
}

export interface FontSize {
    name: string;
    className: string;
}

export interface FontWeight {
    name: string;
    className: string;
}

export interface FontAlign {
    name: string;
    className: string;
}

export const headingFontSizes: DropdownElement[] = [
    {
        name: "36",
        value: "text-3xl",
    },
    {
        name: "40",
        value: "text-4xl",
    },
    {
        name: "48",
        value: "text-5xl",
    },
];
export const paragraphFontSizes: DropdownElement[] = [
    {
        name: "16",
        value: "text-base",
    },
    {
        name: "18",
        value: "text-lg",
    },
    {
        name: "20",
        value: "text-xl",
    },
];
export const fontAligns: DropdownElement[] = [
    {
        name: "Left",
        value: "text-left",
    },
    {
        name: "Center",
        value: "text-center",
    },
    {
        name: "Right",
        value: "text-right",
    },
];
export const fontWeights: DropdownElement[] = [
    {
        name: "Light",
        value: "font-light",
    },
    {
        name: "Normal",
        value: "font-normal",
    },
    {
        name: "Bold",
        value: "font-bold",
    },
];
