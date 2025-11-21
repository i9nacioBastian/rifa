import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, className = '' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-scaleIn ${className}`}>
                {children}
            </div>
        </div>
    );
}

export function ModalHeader({ children, onClose }) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">{children}</h3>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            )}
        </div>
    );
}

export function ModalBody({ children, className = '' }) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}

export function ModalFooter({ children }) {
    return (
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            {children}
        </div>
    );
}
