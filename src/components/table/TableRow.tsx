export default function TableRow({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableRowStyle =
        "border-t border-t-1 border-t-gray-300 dark:bg-gray-800 dark:text-white dark:border-t-gray-700";
    return <tr className={[tableRowStyle, className].join(" ")}>{children}</tr>;
}
