import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type ModalPosition = 'left' | 'right' | 'center';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    size?: ModalSize;
    position?: ModalPosition;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    className?: string;
    overlayClassName?: string;
    contentClassName?: string;
    headerClassName?: string;
    footer?: React.ReactNode;
    footerClassName?: string;
    maxHeight?: boolean;
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         size = 'md',
                                         position = 'right',
                                         showCloseButton = true,
                                         closeOnOverlayClick = true,
                                         closeOnEscape = true,
                                         className = '',
                                         overlayClassName = '',
                                         contentClassName = '',
                                         headerClassName = '',
                                         footer,
                                         footerClassName = '',
                                         maxHeight = false
                                     }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Store the previously focused element
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Focus the modal
            modalRef.current?.focus();

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll
            document.body.style.overflow = 'unset';

            // Restore focus to previously focused element
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, closeOnEscape, onClose]);

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget && closeOnOverlayClick && size !== 'full') {
            onClose();
        }
    };

    const getSizeClasses = (): string => {
        const sizeMap: Record<ModalSize, string> = {
            xs: 'max-w-xs',
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
            full: 'w-full h-full'
        };
        return sizeMap[size];
    };

    const getPositionClasses = (): string => {
        if (size === 'full') {
            return 'items-start justify-start';
        }

        const positionMap: Record<ModalPosition, string> = {
            left: 'items-start justify-start',
            right: 'items-start justify-end',
            center: 'items-center justify-center'
        };
        return positionMap[position];
    };

    const getModalPositionClasses = (): string => {
        if (size === 'full') {
            return 'h-full max-h-screen overflow-hidden';
        }

        if (position === 'left' || position === 'right') {
            return `h-full ${maxHeight ? 'max-h-screen' : ''} rounded-2xl`;
        }
        return `rounded-2xl ${maxHeight ? 'max-h-[90vh] overflow-hidden' : ''}`;
    };

    const getContainerPadding = (): string => {
        return size === 'full' ? 'p-0' : 'p-4';
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 ${overlayClassName}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* Backdrop - Hidden for full screen */}
            {size !== 'full' && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-700"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Modal Container */}
            <div
                className={`fixed inset-0 flex ${getContainerPadding()} ${getPositionClasses()}`}
                onClick={handleOverlayClick}
            >
                {/* Modal Content */}
                <div
                    ref={modalRef}
                    tabIndex={-1}
                    className={`
            relative w-full ${getSizeClasses()} bg-white shadow-2xl transform transition-all duration-700 ease-out flex flex-col
            ${getModalPositionClasses()}
            ${size === 'full'
                        ? "animate-in fade-in-0"
                        : position === "center"
                            ? "animate-in fade-in-0 zoom-in-95"
                            : position === "left"
                                ? "animate-in slide-in-from-left-full"
                                : "animate-in slide-in-from-right-full"
                    }
            ${className}
          `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div
                            className={`flex items-center justify-between px-6 py-3 border-b border-gray-200 flex-shrink-0 ${headerClassName}`}>
                            {title && (
                                <h2
                                    id="modal-title"
                                    className="text-xl font-semibold text-gray-900 truncate pr-4"
                                >
                                    {title}
                                </h2>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label="Close modal"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className={`flex-1 min-h-0 overflow-y-auto ${maxHeight || size === 'full' ? "overflow-y-auto" : ""} ${contentClassName}`}>
                        {(maxHeight && (position === "left" || position === "right")) || size === 'full' ? (
                            <div className="p-6 min-h-0 flex-1">
                                {children}
                            </div>
                        ) : (
                            <div className="p-6">
                                {children}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div
                            className={`px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 ${size === 'full' ? '' : 'rounded-2xl'} ${footerClassName}`}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;

export const ModalExample: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState<ModalPosition>("left");
    const [size, setSize] = React.useState<ModalSize>("md");

    const footer = (
        <div className="flex justify-end space-x-3">
            <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                Cancel
            </button>
            <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                Save Changes
            </button>
        </div>
    );

    return (
        <div className="p-8 space-y-4">
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as ModalPosition)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        disabled={size === 'full'}
                    >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                        <option value="center">Center</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value as ModalSize)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="xs">Extra Small</option>
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                        <option value="xl">Extra Large</option>
                        <option value="2xl">2X Large</option>
                        <option value="full">Full Screen</option>
                    </select>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
                Open Modal
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Example Modal"
                size={size}
                position={position}
                footer={footer}
                maxHeight={position !== 'center'}
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        This is an example of the multipurpose modal component. It supports different sizes, positions, and configurations.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                            <li>Multiple sizes (xs, sm, md, lg, xl, 2xl, full screen)</li>
                            <li>Three positions (left, right, center)</li>
                            <li>Customizable styling with className props</li>
                            <li>Keyboard navigation and accessibility</li>
                            <li>Click outside to close (disabled for full screen)</li>
                            <li>Smooth animations</li>
                            <li>Optional footer with actions</li>
                            <li>Full screen mode without margins or border radius</li>
                        </ul>
                    </div>

                    {(position === 'left' || position === 'right' || size === 'full') && (
                        <div className="space-y-2">
                            {Array.from({ length: 20 }, (_, i) => (
                                <p key={i} className="text-gray-600">
                                    This is paragraph {i + 1} to demonstrate scrolling in side panels{size === 'full' ? ' and full screen mode' : ''}.
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};