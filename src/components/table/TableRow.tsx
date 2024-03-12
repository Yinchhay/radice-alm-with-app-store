export default function TableRow({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableRowStyle = "border-t border-t-1 border-t-gray-300";
    return <tr className={[tableRowStyle, className].join(" ")}>{children}</tr>;
}
