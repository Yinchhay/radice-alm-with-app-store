import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
};

const InputField = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
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
    },
);

export default InputField;
