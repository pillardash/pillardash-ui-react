import { ReactNode } from "react";

const Card = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
    return (
        <div className={`w-full
            rounded-2xl
            backdrop-blur-2xl
            bg-white
            border border-[#EEEEF0]
            shadow-xl
            shadow-black/0
            hover:shadow-2xl
            hover:shadow-black/10
            hover:bg-white/90
            transition-all
            duration-300
            ease-out
            {/*hover:scale-[1.01]*/}
            hover:-translate-y-0.5
            p-4
            relative
            before:absolute
            before:inset-0
            before:rounded-2xl
            before:bg-gradient-to-br
            before:from-white/10
            before:to-transparent
            before:pointer-events-none ${className}`}>{children}</div>
    );
};

export default Card;
