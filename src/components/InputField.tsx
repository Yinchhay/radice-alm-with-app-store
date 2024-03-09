"use client";
import { useState } from "react";

export default function InputField({
    onClick,
    className = "",
    disabled = false,
    placeholder = "",
    value,
    id,
    name,
    onChange,
}: {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    id?: string;
    name?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Changed the type to React.ChangeEvent<HTMLInputElement>
}) {
    return (
        <input
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            id={id}
            name={name}
            className={[
                "w-full bg-gray-100 text-black px-3 py-1 rounded-md outline outline-1 outline-gray-300 transition-all duration-150 focus:outline-2 focus:outline-blue-400",
                disabled ? "brightness-90" : "",
            ].join(" ")}
            disabled={disabled}
        />
    );
}
