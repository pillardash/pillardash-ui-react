import React from "react";

export interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "secondary" | "success" | "warning" | "error" | "info";
    size?: "sm" | "md" | "lg";
    className?: string;
    onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "default",
    size = "md",
    className = "",
    onClick,
}) => {
    const baseClasses =
        "inline-flex items-center font-medium rounded-full transition-colors duration-200";

    const variantClasses = {
        default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        secondary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        error: "bg-red-100 text-red-800 hover:bg-red-200",
        info: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    };

    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        onClick ? "cursor-pointer" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span
            className={classes}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onClick();
                          }
                      }
                    : undefined
            }
        >
            {children}
        </span>
    );
};

export default Badge;
