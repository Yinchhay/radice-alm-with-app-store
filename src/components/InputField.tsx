import { IconSearch } from "@tabler/icons-react";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    isSearch?: boolean;
};

const InputField = forwardRef<HTMLInputElement, InputProps>(
    ({ className, isSearch = false, ...props }, ref) => {
        if (isSearch) {
            return (
                <div className="relative">
                    <label className="absolute top-0 left-0 mt-2 ml-2 pointer-events-none opacity-40">
                        <IconSearch size={18} />
                    </label>
                    <input
                        ref={ref}
                        className={[
                            "w-full bg-gray-100 text-black px-3 pl-8 py-1 rounded-md outline outline-1 outline-gray-300 transition-all duration-150 focus:outline-2 focus:outline-blue-400",
                            className,
                            props.disabled ? "brightness-90" : "",
                        ].join(" ")}
                        {...props}
                    />
                </div>
            );
        } else {
            return (
                <input
                    ref={ref}
                    className={[
                        "w-full bg-gray-100 text-black px-3 py-1 rounded-md outline outline-1 outline-gray-300 transition-all duration-150 focus:outline-2 focus:outline-blue-400",
                        className,
                        props.disabled ? "brightness-90" : "",
                    ].join(" ")}
                    {...props}
                />
            );
        }
    },
);

export default InputField;
