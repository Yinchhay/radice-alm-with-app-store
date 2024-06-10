export default function Tooltip({
    title,
    className = "",
    children,
    position = "top",
    zIndex = 40,
}: {
    title: string;
    className?: string;
    children: React.ReactNode;
    position?: "top" | "right" | "bottom" | "left";
    zIndex?: number;
}) {
    let positionClassName = "";

    switch (position) {
        case "top":
            positionClassName =
                "bottom-[100%] left-[50%] translate-x-[-50%] mb-2";
            break;
        case "right":
            positionClassName = "top-[50%] left-[100%] translate-y-[-50%] ml-2";
            break;
        case "bottom":
            positionClassName = "top-[100%] left-[50%] translate-x-[-50%] mt-2";
            break;
        case "left":
            positionClassName =
                "top-[50%] right-[100%] translate-y-[-50%] mr-2";
            break;
    }
    return (
        <div className={`relative group w-fit ${className}`}>
            {children}
            <div
                style={{ zIndex }}
                className={`absolute pointer-events-none text-nowrap opacity-0 transition-all ${positionClassName} group-hover:opacity-100 bg-white rounded-sm p-2 border shadow-sm`}
            >
                {title}
            </div>
        </div>
    );
}
