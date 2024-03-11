export default function Button({
    onClick,
    disabled = false,
    styleType = "outline",
    children,
    type= "submit",
}: {
    type?: "submit" | "reset" | "button" | undefined;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    styleType?: string;
    children: React.ReactNode;
}) {
    let buttonStyle = "";
    switch (styleType) {
        case "outline":
            buttonStyle =
                "bg-gray-100 text-black px-3 py-1 rounded-md outline outline-1 outline-gray-300";
            break;
        case "primary":
            buttonStyle = "bg-blue-500 text-white px-3 py-1 rounded-md";
            break;
        case "secondary":
            buttonStyle = "bg-gray-100 text-black px-3 py-1 rounded-md";
            break;
        case "danger":
            buttonStyle = "bg-red-500 text-white px-3 py-1 rounded-md";
            break;
        default:
            buttonStyle = "bg-gray-500 text-white";
    }
    return (
        <button
            type={type}
            onClick={onClick}
            className={[
                buttonStyle,
                "transition-all duration-150",
                disabled ? "brightness-75" : "hover:brightness-90",
            ].join(" ")}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
