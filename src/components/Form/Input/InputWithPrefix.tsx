import React, { ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { ChevronDown, DollarSign, Phone, User } from "lucide-react";

export interface InputWithPrefixProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
        "onChange" | "size" | "prefix"
    > {
    id: string;
    value: string;
    onChange?: (value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

    // New props for prefix functionality
    prefixContent?: React.ReactNode;
    prefixClassName?: string;
    onPrefixChange?: (value: any) => void;
}

const InputWithPrefix: React.FC<InputWithPrefixProps> = ({
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
                                                             prefixContent,
                                                             prefixClassName = "",
                                                             onPrefixChange,
                                                             ...restProps
                                                         }) => {
    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    const sizeClasses = {
        sm: "text-xs py-1.5 text-sm min-h-[32px]",
        md: "text-sm py-2 text-base min-h-[40px]",
        lg: "text-base py-3 text-lg min-h-[48px]",
    };

    const prefixSizeClasses = {
        sm: "px-3 text-xs",
        md: "px-4 text-sm",
        lg: "px-4 text-base",
    };

    const inputPaddingClasses = {
        sm: "pl-3 pr-3",
        md: "pl-4 pr-4",
        lg: "pl-4 pr-4",
    };

    // Determine if we need extra padding for icons
    const getIconPadding = () => {
        let leftPadding = "";
        let rightPadding = "";

        if (icon && iconPosition === "left") {
            leftPadding = "pl-10";
        }
        if (icon && iconPosition === "right") {
            rightPadding = "pr-10";
        }
        if (rightIcon) {
            rightPadding = "pr-10";
        }

        return `${leftPadding} ${rightPadding}`;
    };

    const baseInputClasses = `
        flex-1 rounded-none rounded-r-[12px] border-l-0 ${sizeClasses[size]} 
        ${error ? "border-red-500" : "border-gray-200"}
        ${disabled ? "bg-gray-100 text-gray-500 placeholder-gray-300" : "bg-gray-100 placeholder-gray-400 text-dark"}
        focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
        ${getIconPadding()}
        ${className}
    `;

    const prefixClasses = `
        flex items-center rounded-l-[12px] border border-r-0 ${prefixSizeClasses[size]}
        ${error ? "border-red-500" : "border-gray-200"}
        ${disabled ? "bg-gray-50" : "bg-gray-50"}
        ${prefixClassName}
    `;

    const commonInputProps = {
        id,
        value,
        onChange: handleChange,
        placeholder,
        disabled,
        className: baseInputClasses,
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-error` : helpText ? `${id}-help` : undefined,
    };

    return (
        <div className='mb-4'>
            {label && (
                <label htmlFor={id} className='mb-1 block text-sm font-medium text-gray-600'>
                    {label}
                    {required && <span className='ml-1 text-red-500'>*</span>}
                </label>
            )}

            <div className='relative'>
                <div className='flex'>
                    {/* Prefix Section */}
                    {prefixContent && (
                        <div className={prefixClasses}>
                            {prefixContent}
                        </div>
                    )}

                    {/* Input Section */}
                    <div className={`relative ${prefixContent ? 'flex-1' : 'w-full'}`}>
                        {icon && iconPosition === "left" && (
                            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10'>
                                {icon}
                            </div>
                        )}

                        {type === "textarea" ? (
                            <textarea
                                {...commonInputProps}
                                rows={4}
                                className={`${commonInputProps.className} resize-none ${!prefixContent ? 'rounded-l-[12px] border-l' : ''}`}
                                {...(restProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                            />
                        ) : (
                            <input
                                {...commonInputProps}
                                type={type}
                                className={`${commonInputProps.className} ${!prefixContent ? 'rounded-l-[12px] border-l' : ''}`}
                                {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
                            />
                        )}

                        {icon && iconPosition === "right" && (
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 z-10'>
                                {icon}
                            </div>
                        )}

                        {rightIcon && (
                            <div className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10'>
                                {rightIcon}
                            </div>
                        )}
                    </div>
                </div>
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


export default InputWithPrefix;

export const InputWithPrefixDemo = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [username, setUsername] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('+234');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const countries = [
        { code: '+234', flag: '🇳🇬', country: 'Nigeria' },
        { code: '+1', flag: '🇺🇸', country: 'United States' },
        { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
        { code: '+91', flag: '🇮🇳', country: 'India' },
        { code: '+86', flag: '🇨🇳', country: 'China' },
    ];

    const currencies = ['USD', 'EUR', 'GBP', 'NGN', 'JPY'];

    return (
        <div className="max-w-2xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">InputWithPrefix Component Demo</h1>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {/* Phone Number with Country Code Selector */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Phone Number with Country Code</h2>
                    <InputWithPrefix
                        id="phone"
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        icon={<Phone className="h-5 w-5 text-gray-400" />}
                        iconPosition="right"
                        required
                        prefixContent={
                            <div className="flex items-center">
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 pr-2"
                                >
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.flag} {country.code}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        }
                        prefixClassName="min-w-[120px] justify-between"
                    />
                </div>

                {/* Amount with Currency Selector */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Amount with Currency</h2>
                    <InputWithPrefix
                        id="amount"
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        type="number"
                        prefixContent={
                            <div className="flex items-center">
                                <select
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 pr-2"
                                >
                                    {currencies.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        }
                        prefixClassName="min-w-[80px] justify-between"
                    />
                </div>

                {/* Username with @ symbol */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Username with @ Symbol</h2>
                    <InputWithPrefix
                        id="username"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your-username"
                        icon={<User className="h-5 w-5 text-gray-400" />}
                        iconPosition="right"
                        prefixContent={
                            <span className="text-gray-600 font-medium">@</span>
                        }
                        helpText="Choose a unique username"
                    />
                </div>

                {/* Static Currency Symbol */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Price with Static Currency</h2>
                    <InputWithPrefix
                        id="price"
                        label="Price"
                        value=""
                        onChange={() => {}}
                        placeholder="0.00"
                        type="number"
                        prefixContent={
                            <DollarSign className="h-5 w-5 text-gray-600" />
                        }
                        prefixClassName="min-w-[50px] justify-center"
                    />
                </div>

                {/* Custom HTML in Prefix */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Custom Prefix Content</h2>
                    <InputWithPrefix
                        id="custom"
                        label="Website URL"
                        value=""
                        onChange={() => {}}
                        placeholder="your-site"
                        prefixContent={
                            <div className="flex items-center space-x-1">
                                <span className="text-blue-600 font-medium">https://</span>
                                <div className="h-4 w-px bg-gray-300"></div>
                            </div>
                        }
                        prefixClassName="min-w-[90px]"
                    />
                </div>
            </div>
        </div>
    );
};
