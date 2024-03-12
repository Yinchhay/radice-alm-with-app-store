export default function TableHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableHeaderStyle = "";
    return (
        <thead className={[tableHeaderStyle, className].join(" ")}>
            <tr>{children}</tr>
        </thead>
    );
}
