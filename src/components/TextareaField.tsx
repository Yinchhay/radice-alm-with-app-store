import { IconSearch } from "@tabler/icons-react";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
    className?: string;
};

const TextareaField = forwardRef<HTMLTextAreaElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={[
                    "w-full bg-white text-black px-3 py-1 rounded-sm outline outline-1 outline-gray-300 focus:outline-2 focus:outline-blue-400",
                    className,
                    props.disabled ? "brightness-90" : "",
                ].join(" ")}
                {...props}
            />
        );
    },
);

export default TextareaField;
