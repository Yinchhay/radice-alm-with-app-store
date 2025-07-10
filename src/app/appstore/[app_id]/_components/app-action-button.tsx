"use client";

interface AppActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const AppActionButton: React.FC<AppActionButtonProps> = ({
    children, onClick, disabled = false, className = ""
}) => {
    const baseClasses = "text-sm bg-black text-white py-2 px-10 rounded-lg transition-colors w-fit";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
    return (
        <button 
            className={`${baseClasses} ${disabledClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
};

export default AppActionButton;