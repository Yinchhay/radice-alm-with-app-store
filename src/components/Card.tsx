export default function Card({
    children,
    className = "",
    square = false,
}: {
    children: React.ReactNode;
    className?: string;
    square?: boolean;
}) {
    let cardStyle =
        "bg-white text-black rounded-sm outline outline-1 outline-gray-300";
    let padding = square ? "p-4": "px-6 py-4";
    return <div className={[cardStyle, padding,className].join(" ")}>{children}</div>;
}