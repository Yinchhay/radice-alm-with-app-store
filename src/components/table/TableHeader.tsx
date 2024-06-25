export default function TableHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableHeaderStyle =
        "bg-white border-b border-b-1 border-b-gray-300 dark:bg-gray-800 dark:text-white dark:outline-gray-700 dark:border-gray-700";
    return (
        <thead className={[tableHeaderStyle, className].join(" ")}>
            <tr>{children}</tr>
        </thead>
    );
}
