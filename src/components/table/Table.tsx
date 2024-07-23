export default function Table({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableStyle =
        "table-auto text-black px-6 py-4 rounded-md outline outline-1 outline-gray-300 dark:bg-gray-800 dark:text-white dark:outline-gray-700";
    return (
        <table className={[tableStyle, className].join(" ")}>{children}</table>
    );
}
