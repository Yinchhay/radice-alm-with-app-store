export default function ColumName({
    children,
    className = "",
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    let columNameStyle =
        "text-black px-6 py-4 rounded-md dark:bg-gray-800 dark:text-white dark:outline-gray-700";
    return (
        <th className={[columNameStyle, className].join(" ")}>{children}</th>
    );
}
