import { IconSearch } from "@tabler/icons-react";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    isSearch?: boolean;
};

const InputField = forwardRef<HTMLInputElement, InputProps>(
    ({ className, isSearch = false, ...props }, ref) => {
        const baseClasses = [
            "text-sm flex h-10 px-3 py-2 items-center gap-3 self-stretch rounded-lg border border-gray-400 focus:outline-2 focus:outline-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
            "w-full text-black transition-all duration-150",
            props.disabled ? "brightness-90" : "",
            className,
        ].join(" ");

        if (isSearch) {
            return (
                <div className="relative flex items-center w-full">
                    <IconSearch size={18} className="absolute left-3 text-gray-500 dark:text-gray-400" />
                    <input
                        ref={ref}
                        className={[
                            baseClasses,
                            "pl-10",
                        ].join(" ")}
                        {...props}
                    />
                </div>
            );
        } else {
            return (
                <input
                    ref={ref}
                    className={baseClasses}
                    {...props}
                />
            );
        }
    },
);

export default InputField;