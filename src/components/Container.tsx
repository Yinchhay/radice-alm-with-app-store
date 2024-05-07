export default function Container({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={["p-4 w-full max-w-[1200px] mx-auto", className].join(
                " ",
            )}
        >
            {children}
        </div>
    );
}
