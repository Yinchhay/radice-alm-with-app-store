import Link from "next/link";
import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text?: string;
    link?: string;
    variant: "dark" | "light";
};

const TechButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ text, link, variant, className, ...props }, ref) => {
        if (link) {
            switch (variant) {
                case "dark":
                    return (
                        <div className={["flex mx-[8px]", className].join(" ")}>
                            <Link
                                href={link}
                                className="relative group inline-block"
                            >
                                <div className="bg-black grid place-items-center text-white text-2xl font-bold w-[160px] h-[50px] group-hover:text-[1.7rem] transition-all">
                                    {text}
                                </div>
                                <div className="transition-all border-t border-l border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group"></div>
                                <div className="transition-all border-b border-l border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem]"></div>
                                <div className="transition-all border-t border-r border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                                <div className="transition-all border-b border-r border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                            </Link>
                        </div>
                    );
                case "light":
                    return (
                        <div className={["flex mx-[8px]", className].join(" ")}>
                            <Link href={link} className="relative group">
                                <div className="bg-white grid place-items-center text-black text-2xl font-bold w-[160px] h-[50px] group-hover:text-[1.7rem] transition-all">
                                    {text}
                                </div>
                                <div className="transition-all border-t border-l border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group"></div>
                                <div className="transition-all border-b border-l border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem]"></div>
                                <div className="transition-all border-t border-r border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                                <div className="transition-all border-b border-r border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                            </Link>
                        </div>
                    );
            }
        } else {
            switch (variant) {
                case "dark":
                    return (
                        <div className={["flex mx-[8px]", className].join(" ")}>
                            <button
                                className="relative group inline-block"
                                ref={ref}
                                {...props}
                            >
                                <div className="bg-black grid place-items-center text-white text-2xl font-bold w-[160px] h-[50px] group-hover:text-[1.7rem] transition-all">
                                    {text}
                                </div>
                                <div className="transition-all border-t border-l border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group"></div>
                                <div className="transition-all border-b border-l border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem]"></div>
                                <div className="transition-all border-t border-r border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                                <div className="transition-all border-b border-r border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                            </button>
                        </div>
                    );
                case "light":
                    return (
                        <div className={["flex mx-[8px]", className].join(" ")}>
                            <div className="relative group">
                                <button
                                    ref={ref}
                                    {...props}
                                    className="bg-white text-black text-2xl font-bold w-[160px] h-[50px] group-hover:text-[1.7rem] transition-all"
                                >
                                    {text}
                                </button>
                                <div className="transition-all border-t border-l border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group"></div>
                                <div className="transition-all border-b border-l border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem]"></div>
                                <div className="transition-all border-t border-r border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                                <div className="transition-all border-b border-r border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem]"></div>
                            </div>
                        </div>
                    );
            }
        }
    },
);

export default TechButton;
