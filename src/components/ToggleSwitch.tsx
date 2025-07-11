"use client";
import { useEffect, useState } from "react";

export default function ToggleSwitch({
    defaultState = false,
    onChange,
    yesLabel = "Yes",
    noLabel = "No",
}: {
    defaultState?: boolean;
    onChange?: (state: boolean) => void;
    yesLabel?: string;
    noLabel?: string;
}) {
    const [toggleOn, setToggleOn] = useState<boolean>(defaultState);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setToggleOn(defaultState);
        setHydrated(true);
    }, [defaultState]);

    if (!hydrated) {
        return null;
    }

    return (
        <div className="p-1 border border-gray-300 rounded-md inline-flex bg-white gap-1">
            <button
                type="button"
                onClick={() => {
                    setToggleOn(true);
                    if (onChange) onChange(true);
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    toggleOn
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                {yesLabel}
            </button>
            <button
                type="button"
                onClick={() => {
                    setToggleOn(false);
                    if (onChange) onChange(false);
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    !toggleOn
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                {noLabel}
            </button>
        </div>
    );
}
