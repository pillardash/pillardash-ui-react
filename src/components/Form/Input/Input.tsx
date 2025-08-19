import React, { ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
export type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export interface InputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
        "onChange" | "size"
    > {
    id?: string;
    value: string;
    onChange?: (value: React.ChangeEvent<InputElement>) => void;
    placeholder?: string;
    error?: string;
    label?: string;
    required?: boolean;
    helpText?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    rightIcon?: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
    block?: boolean
}

const Input: React.FC<InputProps> = ({
    id,
    label,
    value,
    size = "md",
    onChange,
    placeholder,
    error,
    required = false,
    helpText,
    type = "text",
    className = "",
    disabled = false,
    icon,
    iconPosition = "left",
    rightIcon,
    block,

    ...restProps
}) => {
    // Handle input change
    const handleChange = (e: ChangeEvent<InputElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    const sizeClasses = {
        sm: "text-xs px-3 py-1.5 text-sm min-h-[32px]",
        md: "text-sm px-4 py-2 text-base min-h-[40px]",
        lg: "text-base px-4 py-3 text-lg min-h-[48px]",
    };

    // const iconSizeClasses = {
    //     sm: "h-4 w-4",
    //     md: "h-5 w-5",
    //     lg: "h-6 w-6",
    // };

    const commonProps = {
        id,
        value,
        onChange: handleChange,
        placeholder,
        disabled,
        className: `w-full rounded-[12px] border ${
            sizeClasses[size]
        } ${
            error ? "border-red-500" : "border-gray-200"
        } ${
            disabled
                ? "bg-gray-100 text-gray-500 placeholder-gray-300"
                : "bg-gray-100 placeholder-gray-400 text-dark"
        } focus:outline-none focus:ring-1 focus:ring-primary ${className} ${
            icon && iconPosition === "left" ? "pl-10" : ""
        } ${icon && iconPosition === "right" ? "pr-10" : ""}`,
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-error` : helpText ? `${id}-help` : undefined,
    };

    return (
        <div className={`mb-4 ${block && "w-full"}`}>
            {label && <label htmlFor={id} className='mb-1 block text-sm font-medium text-gray-600'>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
            </label>}

            <div className='relative'>
                {icon && iconPosition === "left" && (
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        {icon}
                    </div>
                )}
                {type == "textarea" ? (
                    <textarea
                        {...commonProps}
                        rows={4}
                        className={`${commonProps.className} resize-none`}
                        {...(restProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    />
                ) : (
                    <input
                        {...commonProps}
                        type={type}
                        {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
                    />
                )}

                {icon && iconPosition === "right" && (
                    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                        {icon}
                    </div>
                )}
                {rightIcon && (
                    <div className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'>
                        {rightIcon}
                    </div>
                )}
            </div>

            {helpText && !error && (
                <p id={`${id}-help`} className='mt-1 text-sm text-gray-500'>
                    {helpText}
                </p>
            )}

            {error && (
                <p id={`${id}-error`} className='mt-1 text-sm text-red-500'>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
