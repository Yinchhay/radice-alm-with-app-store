import { Roboto_Flex } from "next/font/google";
import Link from "next/link";
import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text?: string;
    link?: string;
    variant: "dark" | "light";
};

const roboto_flex = Roboto_Flex({ subsets: ["latin"] });

const TechButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ text, link, variant, className, ...props }, ref) => {
        if (link) {
            switch (variant) {
                case "dark":
                    return (
                        <div
                            className={[
                                "flex mx-[8px]",
                                className,
                                roboto_flex.className,
                            ].join(" ")}
                        >
                            <Link
                                href={link}
                                className="relative group inline-block"
                            >
                                <div className="bg-black grid place-items-center text-white text-lg lg:text-2xl font-bold w-[120px] h-[40px] lg:w-[160px] lg:h-[50px] group-hover:text-base lg:group-hover:text-[1.7rem] transition-all group-active:text-lg lg:group-active:text-2xl group-active:duration-75">
                                    {text}
                                </div>
                                <div className="duration-200 group-active:duration-75 border-t border-l border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group-active:top-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-l border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem] group-active:bottom-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-t border-r border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem] group-active:top-[-0.5rem] group-active:right-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-r border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem] group-active:bottom-[-0.5rem] group-active:right-[-0.5rem]"></div>
                            </Link>
                        </div>
                    );
                case "light":
                    return (
                        <div className={["flex mx-[8px]", className].join(" ")}>
                            <Link href={link} className="relative group">
                                <div className="bg-white grid place-items-center text-black text-lg lg:text-2xl font-bold w-[120px] h-[40px] lg:w-[160px] lg:h-[50px] group-hover:text-base lg:group-hover:text-[1.7rem] transition-all group-active:text-lg lg:group-active:text-2xl group-active:duration-75">
                                    {text}
                                </div>
                                <div className="duration-200 group-active:duration-75 border-t border-l border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group-active:top-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-l border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem] group-active:bottom-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-t border-r border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem] group-active:top-[-0.5rem] group-active:right-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-r border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem] group-active:bottom-[-0.5rem] group-active:right-[-0.5rem]"></div>
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
                                <div className="bg-black grid place-items-center text-white text-2xl font-bold w-[160px] h-[50px] group-hover:text-[1.7rem] transition-all group-active:text-2xl group-active:duration-75">
                                    {text}
                                </div>
                                <div className="duration-200 group-active:duration-75 border-t border-l border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group-active:top-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-l border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem] group-active:bottom-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-t border-r border-black w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem] group-active:top-[-0.5rem] group-active:right-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-r border-black w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem] group-active:bottom-[-0.5rem] group-active:right-[-0.5rem]"></div>
                            </button>
                        </div>
                    );
                case "light":
                    return (
                        <div className={["flex mx-[8px]", className].join(" ")}>
                            <button
                                className="relative group inline-block"
                                ref={ref}
                                {...props}
                            >
                                <div className="bg-white grid place-items-center text-black text-2xl font-bold w-[160px] h-[50px] group-hover:text-[1.7rem] transition-all group-active:text-2xl group-active:duration-75">
                                    {text}
                                </div>
                                <div className="duration-200 group-active:duration-75 border-t border-l border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] left-[-0.5rem] group-hover:top-[-0.25rem] group-hover:left-[-0.25rem] group-active:top-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-l border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] left-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:left-[-0.25rem] group-active:bottom-[-0.5rem] group-active:left-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-t border-r border-white w-6 h-6 bg-transparent absolute top-[-0.5rem] right-[-0.5rem] group-hover:top-[-0.25rem] group-hover:right-[-0.25rem] group-active:top-[-0.5rem] group-active:right-[-0.5rem]"></div>
                                <div className="duration-200 group-active:duration-75 border-b border-r border-white w-6 h-6 bg-transparent absolute bottom-[-0.5rem] right-[-0.5rem] group-hover:bottom-[-0.25rem] group-hover:right-[-0.25rem] group-active:bottom-[-0.5rem] group-active:right-[-0.5rem]"></div>
                            </button>
                        </div>
                    );
            }
        }
    },
);

export default TechButton;
