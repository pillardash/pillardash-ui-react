import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    glass?: boolean;
}

const Card = ({ children, className = "", glass = false }: CardProps) => {
    const baseClasses = `
        w-full
        rounded-2xl
        shadow-xl
        transition-all
        duration-300
        ease-out
        hover:-translate-y-0.5
        p-5
        relative
        z-0
    `;

    const glassClasses = `
        backdrop-blur-xl
        bg-white/20
        border
        border-white/30
        shadow-lg
        hover:shadow-xl
        hover:bg-white/30
        before:absolute
        before:inset-0
        before:rounded-2xl
        before:bg-gradient-to-br
        before:from-white/10
        before:to-transparent
        before:pointer-events-none
    `;

    const solidClasses = `
        backdrop-blur-2xl
        bg-white
    `;

    const combinedClasses = `${baseClasses} ${glass ? glassClasses : solidClasses} ${className}`;

    return (
        <div className={combinedClasses}>
            {children}
        </div>
    );
};

export default Card;
