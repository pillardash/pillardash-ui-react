import React, { useEffect, useRef, useState } from "react";

export interface TooltipProps {
    children: React.ReactNode;
    content: string | React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    variant?: "dark" | "light" | "accent";
    size?: "sm" | "md" | "lg";
    delay?: number;
    disabled?: boolean;
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = "top",
    variant = "light",
    size = "md",
    delay = 200,
    disabled = false,
    className = "",
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [actualPosition, setActualPosition] = useState(position);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // Auto-adjust position based on viewport
    useEffect(() => {
        if (isVisible && tooltipRef.current && triggerRef.current) {
            const tooltip = tooltipRef.current;
            const trigger = triggerRef.current;
            const rect = trigger.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let newPosition = position;

            // Check if tooltip goes outside viewport and adjust
            if (position === "top" && rect.top - tooltipRect.height < 10) {
                newPosition = "bottom";
            } else if (
                position === "bottom" &&
                rect.bottom + tooltipRect.height > window.innerHeight - 10
            ) {
                newPosition = "top";
            } else if (position === "left" && rect.left - tooltipRect.width < 10) {
                newPosition = "right";
            } else if (
                position === "right" &&
                rect.right + tooltipRect.width > window.innerWidth - 10
            ) {
                newPosition = "left";
            }

            setActualPosition(newPosition);
        }
    }, [isVisible, position]);

    const handleMouseEnter = () => {
        if (disabled) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Position classes
    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    // Arrow classes
    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
        left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
        right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
    };

    // Variant styles
    const variantClasses = {
        dark: {
            tooltip: "bg-gray-900 text-white border-gray-700",
            arrow: {
                top: "border-t-gray-900",
                bottom: "border-b-gray-900",
                left: "border-l-gray-900",
                right: "border-r-gray-900",
            },
        },
        light: {
            tooltip: "bg-white text-gray-900 border-gray-200 shadow-lg",
            arrow: {
                top: "border-t-white",
                bottom: "border-b-white",
                left: "border-l-white",
                right: "border-r-white",
            },
        },
        accent: {
            tooltip: "bg-blue-600 text-white border-blue-500",
            arrow: {
                top: "border-t-blue-600",
                bottom: "border-b-blue-600",
                left: "border-l-blue-600",
                right: "border-r-blue-600",
            },
        },
    };

    // Size classes
    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
    };

    if (disabled || !content) {
        return <>{children}</>;
    }

    return (
        <div className='relative inline-block'>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
                className='cursor-help'
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`absolute z-50 ${positionClasses[actualPosition]} ${variantClasses[variant].tooltip} ${sizeClasses[size]} animate-in fade-in-0 zoom-in-95 max-w-xs whitespace-nowrap break-words rounded-lg border font-medium backdrop-blur-sm duration-200 ${className} `}
                    role='tooltip'
                    aria-hidden='false'
                >
                    {content}

                    {/* Arrow */}
                    <div
                        className={`absolute h-0 w-0 border-4 ${arrowClasses[actualPosition]} ${variantClasses[variant].arrow[actualPosition]} `}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
