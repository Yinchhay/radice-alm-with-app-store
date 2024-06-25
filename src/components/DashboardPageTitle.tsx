export default function DashboardPageTitle({
    title,
    className = "",
}: {
    title: string;
    className?: string;
}) {
    return (
        <h1
            className={["font-bold text-3xl dark:text-white", className].join(
                " ",
            )}
        >
            {title}
        </h1>
    );
}
