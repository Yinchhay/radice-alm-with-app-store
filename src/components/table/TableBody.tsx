export default function TableBody({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let tableBodyStyle =
        "bg-white text-black px-6 py-4 border border-1 border-t-gray-300";
    return (
        <tbody className={[tableBodyStyle, className].join(" ")}>
            {children}
        </tbody>
    );
}
