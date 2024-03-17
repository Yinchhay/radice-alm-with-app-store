export default function Cell({
    children,
    className = "",
    dataTest,
}: {
    children?: React.ReactNode;
    className?: string;
    dataTest?: string;
}) {
    let cellStyle = "text-black px-6 py-4 rounded-md";
    return <td data-test={dataTest} className={[cellStyle, className].join(" ")}>{children}</td>;
}
