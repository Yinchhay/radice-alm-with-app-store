import { text } from "stream/consumers";

export default function Chip({
    children,
    className = "",
    textClassName = "",
    bgClassName = "",
}: {
    children: React.ReactNode;
    className?: string;
    textClassName?: string;
    bgClassName?: string;
}) {
    return (
        <div
            className={`py-1 rounded-full transition-all ${textClassName} ${bgClassName} ${className}`}
        >
            {children}
        </div>
    );
}
