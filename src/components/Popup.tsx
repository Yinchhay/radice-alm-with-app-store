import React from 'react';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 mb-1"
                    >
                        ×
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;