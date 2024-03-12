export default function Table({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableStyle =
        "table-auto bg-gray-50 text-black px-6 py-4 rounded-md outline outline-1 outline-gray-300";
    return (
        <table className={[tableStyle, className].join(" ")}>{children}</table>
    );
}
