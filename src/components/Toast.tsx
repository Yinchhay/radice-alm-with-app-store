"use client";
import React, { useState, useEffect } from "react";

export default function Toast({
    children,
    duration = 3500,
}: {
    children: React.ReactNode;
    duration: number;
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => {
            clearTimeout(timeout);
        };
    }, [duration]);

    return (
        <div
            className={`toast bg-white dark:bg-gray-700 dark:outline-gray-600 dark:text-white rounded-sm shadow-md duration-[350ms] ease-in-out max-w-[300px] px-4 ${isVisible ? "py-2 mb-2 scale-1 translate-y-[0] max-h-[300px]" : "scale-0 translate-y-[-4rem] max-h-0"}`}
        >
            {children}
        </div>
    );
}
