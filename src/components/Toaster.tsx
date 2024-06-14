"use client";
import React, { useState, createContext, useContext } from "react";
import Toast from "./Toast";

interface Toast {
    id: number;
    message: React.ReactElement;
    duration: number;
}

interface ToasterProps {
    children: React.ReactNode;
    position?: "top-left" | "top-right" | "top-center";
}

interface ToastContextType {
    addToast: (message: React.ReactElement, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

let toastId = 0;

export default function Toaster({
    children,
    position = "top-right",
}: ToasterProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: React.ReactElement, duration: number = 3500) => {
        const id = toastId++;
        setToasts((prevToasts) => [...prevToasts, { id, message, duration }]);
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
        }, duration + 1000); // Remove toast after the specified duration + 1000ms for transition
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            <div
                className={`fixed ${positionClasses[position]} flex flex-col-reverse z-[60] duration-[350ms]`}
            >
                {toasts.map((toast) => (
                    <Toast key={toast.id} duration={toast.duration}>
                        {toast.message}
                    </Toast>
                ))}
            </div>
            {children}
        </ToastContext.Provider>
    );
}

const positionClasses = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-end",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
};
