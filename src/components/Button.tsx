import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    variant?: "outline" | "primary" | "secondary" | "purple" | "danger" | undefined;
    square?: boolean;
    children: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, square, children, ...props }, ref) => {
        let buttonStyle = "";
        switch (variant) {
            case "outline":
                buttonStyle = "flex px-3 py-2 items-center gap-4 rounded-lg text-sm font-bold bg-white text-black border border-gray-300";
                break;
            case "primary":
                buttonStyle = "flex px-3 py-2 items-center gap-4 rounded-lg text-sm font-bold bg-blue-500 text-white";
                break;
            case "secondary":
                buttonStyle =
                    "flex px-3 py-2 items-center gap-4 rounded-lg text-sm font-bold bg-gray-100 text-black dark:bg-gray-700 dark:outline-gray-500 dark:text-white";
                break;
            case "purple":
                buttonStyle =
                    "flex px-3 py-2 items-center gap-4 rounded-lg text-sm font-bold bg-purple-700 text-white";
                break;
            case "danger":
                buttonStyle = "flex px-3 py-2 items-center gap-4 rounded-lg text-sm font-bold bg-red-500 text-white";
                break;
            default:
                buttonStyle =
                    "flex px-3 py-2 items-center gap-4 rounded-lg text-sm font-bold bg-white text-black outline outline-1 outline-gray-300 dark:bg-gray-700 dark:outline-gray-600 dark:text-white";
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
