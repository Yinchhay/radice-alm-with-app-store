export default function ChipsHolder({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>{children}</div>
    );
}
