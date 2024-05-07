export default function TableHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableHeaderStyle = "bg-white border-b border-b-1 border-b-gray-300";
    return (
        <thead className={[tableHeaderStyle, className].join(" ")}>
            <tr>{children}</tr>
        </thead>
    );
}
