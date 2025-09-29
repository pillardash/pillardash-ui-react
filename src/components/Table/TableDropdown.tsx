import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MoreVertical } from "lucide-react";
import { TableDropdownProps } from "./types";

export default function TableDropdown({
  actions,
  trigger,
  className = "",
  dropdownClassName = "",
}: TableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 300; // Approximate max height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Determine if dropdown should open above or below
      const shouldOpenAbove =
        spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setDropdownPosition({
        top: shouldOpenAbove
          ? rect.top - dropdownHeight + window.scrollY
          : rect.bottom + window.scrollY,
        left: rect.right - 192 + window.scrollX, // 192px is the dropdown width (w-48)
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
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

  // Handle scroll to reposition dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownHeight = 300;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const shouldOpenAbove =
          spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        setDropdownPosition({
          top: shouldOpenAbove
            ? rect.top - dropdownHeight + window.scrollY
            : rect.bottom + window.scrollY,
          left: rect.right - 192 + window.scrollX,
        });
      }
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleActionClick = (action: (typeof actions)[0]) => {
    if (!action.disabled) {
      action.onClick();
      closeDropdown();
    }
  };

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className={`fixed z-[9999] w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${dropdownClassName}`}
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
      }}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
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
            role="menuitem"
          >
            {action.icon && (
              <span className="mr-3 flex-shrink-0">{action.icon}</span>
            )}
            {action.label}
          </button>
        ))}

        {actions.length === 0 && (
          <div className="px-4 py-2 text-sm text-gray-500">
            No actions available
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <div ref={triggerRef} className="flex">
        {trigger ? (
          <div onClick={toggleDropdown} className="cursor-pointer">
            {trigger}
          </div>
        ) : (
          <button
            className="rounded-md border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 focus:ring-offset-2"
            onClick={toggleDropdown}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Render dropdown in a portal */}
      {typeof document !== "undefined" &&
        dropdownContent &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
