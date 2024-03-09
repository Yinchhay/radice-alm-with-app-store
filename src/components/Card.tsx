export default function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    let cardStyle =
        "bg-gray-50 text-black px-6 py-4 rounded-md outline outline-1 outline-gray-300";
    return <div className={[cardStyle, className].join(" ")}>{children}</div>;
}
