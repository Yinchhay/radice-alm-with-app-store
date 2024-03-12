export default function TableRow({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableRowStyle = "";
    return <tr className={[tableRowStyle, className].join(" ")}>{children}</tr>;
}
