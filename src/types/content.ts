export interface Component {
    id: string;
    type: string;
    text?: string;
    url?: string;
    rows?: string[];
    style?: {
        fontSize?: FontSize;
        fontWeight?: FontWeight;
        fontAlign?: FontAlign;
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
