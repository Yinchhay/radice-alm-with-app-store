export default function ColumName({
    children,
    className = "",
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    let columNameStyle = "bg-gray-50 text-black px-6 py-4 rounded-md";
    return (
        <th className={[columNameStyle, className].join(" ")}>{children}</th>
    );
}
