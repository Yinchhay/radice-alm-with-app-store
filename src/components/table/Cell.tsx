export default function Cell({
    children,
    className = "",
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    let cellStyle = "text-black px-6 py-4 rounded-md";
    return <td className={[cellStyle, className].join(" ")}>{children}</td>;
}
