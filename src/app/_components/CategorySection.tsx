export default function CategorySection({
    variant = "light",
    category,
}: {
    variant: string;
    category: {
        id: number;
        name: string;
        isActive: boolean | null;
        description: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    };
}) {
    switch (variant) {
        case "light":
            return (
                <div className="bg-white">
                    <div className="container mx-auto">
                        {" "}
                        <h1 className="text-5xl font-bold">{category.name}</h1>
                    </div>
                </div>
            );
        case "dark":
            return <div></div>;
    }
}
