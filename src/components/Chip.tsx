export default function Chip({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`text-sm bg-gray-200 py-1 px-3 rounded-full hover:bg-black hover:text-white transition-all ${className}`}
        >
            {children}
        </div>
    );
}
