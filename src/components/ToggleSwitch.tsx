"use client";
import { useEffect, useState } from "react";

export default function ToggleSwitch({
    defaultState = false,
    variant = "default",
    onChange,
}: {
    defaultState?: boolean;
    variant?: string;
    onChange?: (state: boolean) => void;
}) {
    const [toggleOn, setToggleOn] = useState<boolean>(defaultState);

    switch (variant) {
        case "secondary":
            return (
                <button
                    type="button"
                    className={[
                        "rounded-full w-[50px] h-[24px] flex items-center relative",
                        toggleOn ? "bg-blue-500" : "bg-gray-400",
                    ].join(" ")}
                    onClick={() => {
                        setToggleOn(!toggleOn);
                        if (onChange) {
                            onChange(!toggleOn);
                        }
                    }}
                >
                    <div
                        className={[
                            "rounded-full w-[18px] h-[18px] bg-white transition-all absolute outline outline-1",
                            toggleOn
                                ? "left-[28px] outline-transparent"
                                : "left-[4px] outline-gray-300",
                        ].join(" ")}
                    ></div>
                </button>
            );
        default:
            return (
                <button
                    type="button"
                    className={[
                        "rounded-full w-[50px] h-[24px] outline outline-1 outline-gray-300 flex items-center relative",
                        toggleOn ? "bg-blue-500" : "bg-gray-200",
                    ].join(" ")}
                    onClick={() => {
                        setToggleOn(!toggleOn);
                        if (onChange) {
                            onChange(!toggleOn);
                        }
                    }}
                >
                    <div
                        className={[
                            "rounded-full w-[18px] h-[18px] bg-white transition-all absolute outline outline-1",
                            toggleOn
                                ? "left-[28px] outline-transparent"
                                : "left-[4px] outline-gray-300",
                        ].join(" ")}
                    ></div>
                </button>
            );
    }
}
