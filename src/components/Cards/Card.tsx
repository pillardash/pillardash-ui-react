import { ReactNode } from "react";

const Card = ({ children, className }: { children: ReactNode, className: string }) => {
    return (
        <div className={`w-full rounded-[20px] border border-[#EEEEF0] bg-white p-4 ${className}`}>{children}</div>
    );
};

export default Card;
