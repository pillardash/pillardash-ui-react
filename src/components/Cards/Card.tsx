import { ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outline" | "glass" | "premium";
type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: CardVariant;
    padding?: CardPadding;
    glass?: boolean;
}

const Card = ({
    children,
    className = "",
    variant = "default",
    padding = "md",
    glass = false,
}: CardProps) => {
    const selectedVariant = glass ? "glass" : variant;

    const baseClasses = `
        w-full
        relative
        rounded-2xl
        transition-all
        duration-200
        ease-out
        z-0
    `;

    const paddingClasses: Record<CardPadding, string> = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    const variantClasses: Record<CardVariant, string> = {
        default: "border border-gray-200/70 bg-white shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
        elevated: "border border-gray-100 bg-white shadow-lg hover:shadow-xl dark:border-gray-800 dark:bg-gray-900",
        outline: "border border-gray-200 bg-white shadow-none dark:border-gray-800 dark:bg-gray-900",
        glass: "border border-white/30 bg-white/20 shadow-lg backdrop-blur-xl hover:bg-white/30 hover:shadow-xl dark:border-gray-700/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:dark:from-gray-900/10",
        premium: "border border-gray-200/70 bg-white shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900 before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent",
    };

    const combinedClasses = `${baseClasses} ${paddingClasses[padding]} ${variantClasses[selectedVariant]} ${className}`;

    return (
        <div className={combinedClasses}>
            {children}
        </div>
    );
};

export default Card;
