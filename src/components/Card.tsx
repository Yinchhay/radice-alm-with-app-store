export default function Card({
    children,
    className = "",
    square = false,
    overWritePadding = false,
}: {
    children: React.ReactNode;
    className?: string;
    square?: boolean;
    overWritePadding?: boolean;
}) {
    let cardStyle =
        "bg-white text-black rounded-lg border border-black/16 dark:bg-gray-800 dark:text-white dark:border-white/16";
    let padding = square ? "p-4" : "px-6 py-4";
    if (overWritePadding) {
        padding = "";
    }
    return (
        <div className={[cardStyle, padding, className].join(" ")}>
            {children}
        </div>
    );
}
