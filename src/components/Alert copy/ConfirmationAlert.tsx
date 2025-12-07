import React, { useEffect, useRef } from "react";

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { Button } from "../Button";

export type ConfirmationType = "default" | "danger" | "warning" | "success" | "info";

export interface ConfirmationPopupProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: ConfirmationType;
    showIcon?: boolean;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    isLoading?: boolean;
    className?: string;
    overlayClassName?: string;
    maxWidth?: "sm" | "md" | "lg";
}

const ConfirmationAlert: React.FC<ConfirmationPopupProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "default",
    showIcon = true,
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    isLoading = false,
    className = "",
    overlayClassName = "",
    maxWidth = "sm",
}) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Store the previously focused element
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Focus the confirm button for keyboard navigation
            setTimeout(() => {
                if (type === "danger") {
                    // For danger actions, focus cancel button first for safety
                    popupRef.current
                        ?.querySelector<HTMLButtonElement>("[data-cancel-button]")
                        ?.focus();
                } else {
                    confirmButtonRef.current?.focus();
                }
            }, 100);

            // Prevent body scroll
            document.body.style.overflow = "hidden";
        } else {
            // Restore body scroll
            document.body.style.overflow = "unset";

            // Restore focus to previously focused element
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, type]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && closeOnEscape && !isLoading) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, closeOnEscape, onCancel, isLoading]);

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget && closeOnOverlayClick && !isLoading) {
            onCancel();
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            onCancel();
        }
    };

    const getTypeStyles = () => {
        const typeMap = {
            default: {
                icon: Info,
                iconColor: "text-blue-600",
                iconBg: "bg-blue-100",
                confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
            },
            danger: {
                icon: XCircle,
                iconColor: "text-red-600",
                iconBg: "bg-red-100",
                confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
            },
            warning: {
                icon: AlertTriangle,
                iconColor: "text-yellow-600",
                iconBg: "bg-yellow-100",
                confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
            },
            success: {
                icon: CheckCircle,
                iconColor: "text-green-600",
                iconBg: "bg-green-100",
                confirmButton: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
            },
            info: {
                icon: Info,
                iconColor: "text-blue-600",
                iconBg: "bg-blue-100",
                confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
            },
        };
        return typeMap[type];
    };

    const getMaxWidthClass = () => {
        const widthMap = {
            sm: "max-w-sm",
            md: "max-w-md",
            lg: "max-w-lg",
        };
        return widthMap[maxWidth];
    };

    const typeStyles = getTypeStyles();
    const IconComponent = typeStyles.icon;

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 ${overlayClassName}`}
            role='dialog'
            aria-modal='true'
            aria-labelledby={title ? "confirmation-title" : undefined}
            aria-describedby='confirmation-message'
        >
            {/* Backdrop */}
            <div
                className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300'
                onClick={handleOverlayClick}
            />

            {/* Popup Container */}
            <div className='fixed inset-0 flex items-center justify-center p-4'>
                {/* Popup Content */}
                <div
                    ref={popupRef}
                    className={`relative w-full ${getMaxWidthClass()} animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 transform rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${className} `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    {showCloseButton && (
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            aria-label='Close'
                        >
                            <X size={20} />
                        </button>
                    )}

                    {/* Content */}
                    <div className='p-6'>
                        <div className='flex flex-col items-center justify-center space-y-4'>
                            {/* Icon */}
                            {showIcon && (
                                <div
                                    className={`h-12 w-12 flex-shrink-0 rounded-full ${typeStyles.iconBg} flex items-center justify-center`}
                                >
                                    <IconComponent size={24} className={typeStyles.iconColor} />
                                </div>
                            )}

                            {/* Text Content */}
                            <div className='min-w-0 flex-1 justify-center'>
                                {title && (
                                    <h3
                                        id='confirmation-title'
                                        className='mb-1 text-center text-lg font-semibold text-gray-900'
                                    >
                                        {title}
                                    </h3>
                                )}
                                <p
                                    id='confirmation-message'
                                    className='leading-relaxed text-gray-600'
                                >
                                    {message}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                            className={`flex ${showIcon ? "justify-center" : "justify-center"} mt-6 space-x-3`}
                        >
                            <Button
                                variant='neutral'
                                outline
                                size='small'
                                data-cancel-button=''
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>

                            <button
                                ref={confirmButtonRef}
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className={`flex min-w-[80px] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${typeStyles.confirmButton} `}
                            >
                                {isLoading ? (
                                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationAlert;

// Hook for easier usage
export const useConfirmation = () => {
    const [confirmationState, setConfirmationState] = React.useState<{
        isOpen: boolean;
        config: Partial<ConfirmationPopupProps>;
        resolve?: (value: boolean) => void;
    }>({
        isOpen: false,
        config: {},
    });

    const confirm = (
        config: Omit<ConfirmationPopupProps, "isOpen" | "onConfirm" | "onCancel">
    ): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmationState({
                isOpen: true,
                config,
                resolve,
            });
        });
    };

    const handleConfirm = () => {
        setConfirmationState((prev) => ({ ...prev, isOpen: false }));
        confirmationState.resolve?.(true);
    };

    const handleCancel = () => {
        setConfirmationState((prev) => ({ ...prev, isOpen: false }));
        confirmationState.resolve?.(false);
    };

    const ConfirmationDialog = () => (
        <ConfirmationAlert
            {...confirmationState.config}
            isOpen={confirmationState.isOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { confirm, ConfirmationDialog };
};

// Example usage component
export const ConfirmationExample: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [type, setType] = React.useState<ConfirmationType>("default");
    const [isLoading, setIsLoading] = React.useState(false);
    const { confirm, ConfirmationDialog } = useConfirmation();

    const handleDirectConfirmation = async (confirmationType: ConfirmationType) => {
        setType(confirmationType);
        setIsOpen(true);
    };

    const handleHookConfirmation = async (confirmationType: ConfirmationType) => {
        const configs: Record<ConfirmationType, Partial<ConfirmationPopupProps>> = {
            default: {
                title: "Confirm Action",
                message: "Are you sure you want to continue with this action?",
                type: "default",
            },
            danger: {
                title: "Delete Item",
                message:
                    "This action cannot be undone. Are you sure you want to delete this item permanently?",
                confirmText: "Delete",
                type: "danger",
            },
            warning: {
                title: "Warning",
                message: "This action may have unintended consequences. Do you want to proceed?",
                confirmText: "Proceed",
                type: "warning",
            },
            success: {
                title: "Success Action",
                message: "Everything looks good! Would you like to save these changes?",
                confirmText: "Save",
                type: "success",
            },
            info: {
                title: "Information",
                message: "This will update your preferences. Continue?",
                confirmText: "Update",
                type: "info",
            },
        };

        const result = await confirm(configs[confirmationType]);
        alert(`User ${result ? "confirmed" : "cancelled"} the action`);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsOpen(false);
        alert("Action confirmed!");
    };

    const handleCancel = () => {
        setIsOpen(false);
        alert("Action cancelled!");
    };

    return (
        <div className='space-y-6 p-8'>
            <div>
                <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                    Confirmation Popup Examples
                </h2>

                <div className='space-y-4'>
                    <div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                            Direct Component Usage
                        </h3>
                        <div className='flex flex-wrap gap-3'>
                            {(
                                [
                                    "default",
                                    "danger",
                                    "warning",
                                    "success",
                                    "info",
                                ] as ConfirmationType[]
                            ).map((confirmationType) => (
                                <button
                                    key={confirmationType}
                                    onClick={() => handleDirectConfirmation(confirmationType)}
                                    className={`rounded-lg px-4 py-2 font-medium capitalize text-white transition-colors duration-200 ${
                                        confirmationType === "default"
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : confirmationType === "danger"
                                              ? "bg-red-600 hover:bg-red-700"
                                              : confirmationType === "warning"
                                                ? "bg-yellow-600 hover:bg-yellow-700"
                                                : confirmationType === "success"
                                                  ? "bg-green-600 hover:bg-green-700"
                                                  : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {confirmationType} Popup
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                            Hook Usage (Recommended)
                        </h3>
                        <div className='flex flex-wrap gap-3'>
                            {(
                                [
                                    "default",
                                    "danger",
                                    "warning",
                                    "success",
                                    "info",
                                ] as ConfirmationType[]
                            ).map((confirmationType) => (
                                <button
                                    key={`hook-${confirmationType}`}
                                    onClick={() => handleHookConfirmation(confirmationType)}
                                    className={`rounded-lg px-4 py-2 font-medium capitalize text-white transition-colors duration-200 ${
                                        confirmationType === "default"
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : confirmationType === "danger"
                                              ? "bg-red-500 hover:bg-red-600"
                                              : confirmationType === "warning"
                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                : confirmationType === "success"
                                                  ? "bg-green-500 hover:bg-green-600"
                                                  : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                >
                                    Hook {confirmationType}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Direct Component */}
            <ConfirmationAlert
                isOpen={isOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                title='Confirm Action'
                message='Are you sure you want to continue? This action cannot be undone.'
                confirmText='Yes, Continue'
                cancelText='Cancel'
                type={type}
                isLoading={isLoading}
            />

            {/* Hook Component */}
            <ConfirmationDialog />
        </div>
    );
};
