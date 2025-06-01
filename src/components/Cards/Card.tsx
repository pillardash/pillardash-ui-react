import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => {
    return (
        <div className='w-full rounded-[20px] border border-[#EEEEF0] bg-white p-4'>{children}</div>
    );
};

export default Card;
