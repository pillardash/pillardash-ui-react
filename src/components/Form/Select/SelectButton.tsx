import React, { useState } from "react";

import { Check, ChevronDown } from "lucide-react";

export type SelectButtonOption = {
    value: string;
    label?: string;
};

export type SelectButtonProps = {
    options: SelectButtonOption[];
    placeholder?: string;
    onChange: (value: string) => void;
    value?: string;
    size?: "sm" | "md";
    className?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    label?: string;
    required?: boolean;
};

export default function SelectButton({
    options,
    placeholder = "Select an option",
    onChange,
    value,
    size = "md",
    className = "",
    name,
    id,
    disabled = false,
    label,
    required,
}: SelectButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectButtonOption | null>(
        value ? options.find((option) => option.value === value) || null : null
    );

    const handleSelect = (option: SelectButtonOption) => {
        setSelectedOption(option);
        onChange(option.value);
        setIsOpen(false);
    };

    // Size classes for the button
    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-base",
    };

    return (
        <div className={`relative inline-block`}>
            {label && (
                <label htmlFor={id} className='mb-1 block text-sm font-medium text-gray-700'>
                    {label}
                    {required && <span className='ml-1 text-red-500'>*</span>}
                </label>
            )}

            <button
                type='button'
                className={`flex w-full items-center justify-between rounded-md border border-gray-200 bg-white shadow-sm ${
                    sizeClasses[size]
                } text-gray-700 hover:bg-gray-50 focus:outline-none ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                id={id}
            >
                <span className='truncate'>
                    {selectedOption ? selectedOption?.label || selectedOption.value : placeholder}
                </span>
                <ChevronDown className={`ml-2 h-4 w-4 ${isOpen ? "rotate-180 transform" : ""}`} />
            </button>

            {isOpen && (
                <div className='absolute z-10 mt-1 max-h-60 w-full p-1 font-medium text-sm overflow-auto rounded-lg bg-white shadow-xl'>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between ${
                                selectedOption?.value === option.value
                                    ? "bg-gray-50 text-black"
                                    : "text-gray-900"
                            }`}
                            onClick={() => handleSelect(option)}
                        >

                            <div>{option.label || option.value}</div>
                            { selectedOption?.value === option.value && <div><Check className="text-primary" /></div> }
                        </div>
                    ))}
                </div>
            )}

            {name && <input type='hidden' name={name} value={selectedOption?.value || ""} />}
        </div>
    );
}
