import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertDialog = ({ isOpen, onClose, onConfirm, title, description, confirmText = "Delete", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>

                {/* Content */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
