import { ReactNode } from "react";
import {Button} from "../Button";

export interface EmptyStateProps {
    title?: string;
    description?: string;
    btnText?: string;
    onClick?: () => void;
    icon?: ReactNode;
    className?: string;
}
export default function EmptyStateCard({
    title = "No Record Found",
    onClick,
    btnText,
    description = "",
    className = "",
    icon,
}: EmptyStateProps) {
    return (
        <div
            className={`my-2 flex min-h-[320px] w-full flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center ${className} `}
            aria-live='polite' // For screen readers
        >
            <div className={`max-w-md space-y-4`}>
                {icon && <div className='mx-auto h-16 w-16 text-gray-300'>{icon}</div>}

                <h2 className='text-xl font-medium text-gray-900'>{title}</h2>

                {description && <p className='text-gray-500'>{description}</p>}

                {btnText && onClick && (
                    <div className='mt-6'>
                        <Button onClick={onClick} size='medium'>
                            {btnText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
