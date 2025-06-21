import React, { FC } from "react";

import { ChevronLeft } from "lucide-react";

export type BreadcrumbItem = {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
};

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showBackButton?: boolean;
    onBackClick?: () => void;
    separator?: string;
    backButtonLabel?: string;
    className?: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({
    items = [],
    onBackClick,
    showBackButton = true,
    separator = " / ",
    className = "",
}) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            {showBackButton && (
                <div onClick={onBackClick} className='cursor-pointer'>
                    <ChevronLeft className='text-gray-500 transition-colors hover:text-gray-700' />
                </div>
            )}
            <p className='text-gray-400'>
                {items.map((item, index) => (
                    <span key={index}>
                        {item.isActive ? (
                            <span className='text-primary'>{item.label}</span>
                        ) : (
                            <span
                                className={
                                    item.onClick
                                        ? "cursor-pointer transition-colors hover:text-gray-600"
                                        : ""
                                }
                                onClick={item.onClick}
                            >
                                {item.label}
                            </span>
                        )}
                        {index < items.length - 1 && separator}
                    </span>
                ))}
            </p>
        </div>
    );
};

export default Breadcrumb;
