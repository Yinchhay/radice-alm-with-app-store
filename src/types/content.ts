import { DropdownElement } from "@/components/Dropdown";

export interface Chapter {
    id: string;
    name: string;
    components: Component[];
}

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

export type TextAlign = "left" | "right" | "center" | "justify";

export const headingFontSizes: DropdownElement[] = [
    {
        name: "36",
        value: "36px",
    },
    {
        name: "40",
        value: "40px",
    },
    {
        name: "48",
        value: "48px",
    },
];
export const paragraphFontSizes: DropdownElement[] = [
    {
        name: "16",
        value: "16px",
    },
    {
        name: "18",
        value: "18px",
    },
    {
        name: "20",
        value: "20px",
    },
];
export const fontAligns: DropdownElement[] = [
    {
        name: "Left",
        value: "start",
    },
    {
        name: "Center",
        value: "center",
    },
    {
        name: "Right",
        value: "end",
    },
];

export const fontWeights: DropdownElement[] = [
    {
        name: "Light",
        value: "300",
    },
    {
        name: "Normal",
        value: "400",
    },
    {
        name: "Bold",
        value: "700",
    },
];
