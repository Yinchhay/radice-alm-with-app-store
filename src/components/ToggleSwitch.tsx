import { useState } from "react";

export default function ToggleSwitch({
    defaultState = false,
    onChange,
}: {
    defaultState?: boolean;
    onChange?: (state: boolean) => void;
}) {
    const [toggleOn, setToggleOn] = useState<boolean>(defaultState);
    return (
        <button
            className={[
                "rounded-full w-[56px] h-[28px] outline outline-1 outline-gray-300 flex items-center relative",
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
                    "rounded-full w-[22px] h-[22px] bg-white transition-all absolute outline outline-1",
                    toggleOn
                        ? "left-[30px] outline-transparent"
                        : "left-[4px] outline-gray-300",
                ].join(" ")}
            ></div>
        </button>
    );
}
