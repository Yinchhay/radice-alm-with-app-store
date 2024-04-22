export default function NavGroup({
    title = "",
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mt-6">
            {title.length > 0 && (
                <h1 className="text-gray-400 font-bold ml-6 text-sm">
                    {title}
                </h1>
            )}
            <ul className="px-4 flex gap-2 flex-col mt-2">{children}</ul>
        </section>
    );
}
