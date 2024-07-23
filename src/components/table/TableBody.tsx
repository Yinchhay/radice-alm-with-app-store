export default function TableBody({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableBodyStyle =
        "bg-white text-black px-6 py-4 dark:bg-gray-800 dark:text-white dark:outline-gray-700";
    return (
        <tbody className={[tableBodyStyle, className].join(" ")}>
            {children}
        </tbody>
    );
}
