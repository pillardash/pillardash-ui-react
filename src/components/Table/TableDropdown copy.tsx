import React, { useEffect, useRef, useState } from "react";

import { MoreVertical } from "lucide-react";
import { TableDropdownProps } from "./types";

export default function TableDropdown({
    actions,
    trigger,
    className = "",
    dropdownClassName = "",
}: TableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscapeKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpen]);

    const handleActionClick = (action: (typeof actions)[0]) => {
        if (!action.disabled) {
            action.onClick();
            closeDropdown();
        }
    };

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            {/* Trigger Button */}
            <div className='flex'>
                {trigger ? (
                    <div onClick={toggleDropdown} className='cursor-pointer'>
                        {trigger}
                    </div>
                ) : (
                    <button
                        className='rounded-md border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 focus:ring-offset-2'
                        onClick={toggleDropdown}
                        aria-expanded={isOpen}
                        aria-haspopup='true'
                    >
                        <MoreVertical className='h-4 w-4' />
                    </button>
                )}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={`absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${dropdownClassName}`}
                >
                    <div className='py-1' role='menu' aria-orientation='vertical'>
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors duration-150 ${
                                    action.disabled
                                        ? "cursor-not-allowed bg-gray-50 text-gray-400"
                                        : action.variant === "danger"
                                          ? "text-red-700 hover:bg-red-50 hover:text-red-900"
                                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                } `}
                                onClick={() => handleActionClick(action)}
                                disabled={action.disabled}
                                role='menuitem'
                            >
                                {action.icon && (
                                    <span className='mr-3 flex-shrink-0'>{action.icon}</span>
                                )}
                                {action.label}
                            </button>
                        ))}

                        {actions.length === 0 && (
                            <div className='px-4 py-2 text-sm text-gray-500'>
                                No actions available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
