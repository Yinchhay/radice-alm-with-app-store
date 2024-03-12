export default function Button({
    onClick,
    className,
    disabled = false,
    styleType = "outline",
    children,
    type = "submit",
    square = false,
}: {
    type?: "submit" | "reset" | "button" | undefined;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    styleType?: "outline" | "primary" | "secondary" | "danger" | undefined;
    children: React.ReactNode;
    square?: boolean;
}) {
    let buttonStyle = "";
    switch (styleType) {
        case "outline":
            buttonStyle =
                "bg-gray-100 text-black rounded-md outline outline-1 outline-gray-300";
            break;
        case "primary":
            buttonStyle = "bg-blue-500 text-white rounded-md";
            break;
        case "secondary":
            buttonStyle = "bg-gray-100 text-black rounded-md";
            break;
        case "danger":
            buttonStyle = "bg-red-500 text-white rounded-md";
            break;
        default:
            buttonStyle = "bg-gray-500 text-white";
    }
    if (square) {
        buttonStyle += " px-1 py-1 aspect-square";
    } else {
        buttonStyle += " px-3 py-1";
    }
    return (
        <button
            type={type}
            onClick={onClick}
            className={[
                buttonStyle,
                "transition-all duration-150",
                className,
                disabled ? "brightness-75" : "hover:brightness-90",
            ].join(" ")}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
