import { text } from "stream/consumers";

export default function Chip({
    children,
    className = "",
    textClassName = "text-black hover:text-white",
    bgClassName = "bg-gray-200 hover:bg-black",
}: {
    children: React.ReactNode;
    className?: string;
    textClassName?: string;
    bgClassName?: string;
}) {
    return (
        <div
            className={`text-sm py-1 px-3 rounded-full  transition-all ${className} ${textClassName} ${bgClassName}`}
        >
            {children}
        </div>
    );
}
