import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    variant?: "outline" | "primary" | "secondary" | "danger" | undefined;
    square?: boolean;
    children: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, square, children, ...props }, ref) => {
        let buttonStyle = "";
        switch (variant) {
            case "outline":
                buttonStyle =
                    "bg-white text-black rounded-sm outline outline-1 outline-gray-300 dark:bg-gray-700 dark:outline-gray-600 dark:text-white";
                break;
            case "primary":
                buttonStyle = "bg-blue-500 text-white rounded-sm";
                break;
            case "secondary":
                buttonStyle =
                    "bg-gray-100 text-black rounded-sm dark:bg-gray-700 dark:outline-gray-500 dark:text-white";
                break;
            case "danger":
                buttonStyle = "bg-red-500 text-white rounded-sm";
                break;
            default:
                buttonStyle =
                    "bg-white text-black rounded-sm outline outline-1 outline-gray-300 outline-gray-300 dark:bg-gray-700 dark:outline-gray-600 dark:text-white";
        }
        if (square) {
            buttonStyle += " px-1 py-1 aspect-square";
        } else {
            buttonStyle += " px-3 py-1";
        }
        return (
            <button
                ref={ref}
                className={[
                    buttonStyle,
                    "transition-all duration-150",
                    className,
                    props.disabled
                        ? "brightness-75 cursor-not-allowed"
                        : "hover:brightness-90",
                ].join(" ")}
                {...props}
            >
                {children}
            </button>
        );
    },
);

export default Button;
