import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface SelectOption {
    value: string;
    label?: string;
    disabled?: boolean;
}

export type SelectProps = {
    options: SelectOption[];
    placeholder?: string;
    onChange: (value: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string | string[];
    size?: "sm" | "md" | "lg";
    className?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    error?: string;
    helpText?: string;
    fullWidth?: boolean;
    searchable?: boolean;
    // New props for multi-select
    multiple?: boolean;
    maxSelected?: number;
    showSelectedCount?: boolean;
    closeOnSelect?: boolean;
};

export default function Select({
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
                                   error,
                                   helpText,
                                   fullWidth = true,
                                   searchable = false,
                                   multiple = false,
                                   maxSelected,
                                   showSelectedCount = false,
                                   closeOnSelect = true,
                               }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Handle both single and multi-select values
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(() => {
        if (!value) return [];

        if (multiple && Array.isArray(value)) {
            return value.map(val => options.find(option => option.value === val)).filter(Boolean) as SelectOption[];
        } else if (!multiple && typeof value === 'string') {
            const option = options.find(option => option.value === value);
            return option ? [option] : [];
        }
        return [];
    });

    const selectRef = useRef<HTMLDivElement>(null);

    // Filter options based on search term if searchable
    const filteredOptions = searchable
        ? options.filter((option) =>
            (option.label || option.value).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    const handleSelect = (option: SelectOption) => {
        if (option.disabled) return;

        let newSelectedOptions: SelectOption[];

        if (multiple) {
            const isAlreadySelected = selectedOptions.some(selected => selected.value === option.value);

            if (isAlreadySelected) {
                // Remove option if already selected
                newSelectedOptions = selectedOptions.filter(selected => selected.value !== option.value);
            } else {
                // Add option if not selected and under max limit
                if (maxSelected && selectedOptions.length >= maxSelected) {
                    return; // Don't add if max limit reached
                }
                newSelectedOptions = [...selectedOptions, option];
            }
        } else {
            newSelectedOptions = [option];
        }

        setSelectedOptions(newSelectedOptions);

        // Simulate a standard change event
        const eventValue = multiple
            ? newSelectedOptions.map(opt => opt.value)
            : newSelectedOptions[0]?.value || '';

        onChange({
            target: {
                id: id || "",
                value: eventValue,
            },
        } as any);

        if (!multiple || closeOnSelect) {
            setIsOpen(false);
            setSearchTerm("");
        }
    };

    const removeOption = (optionToRemove: SelectOption, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSelectedOptions = selectedOptions.filter(option => option.value !== optionToRemove.value);
        setSelectedOptions(newSelectedOptions);

        const eventValue = multiple
            ? newSelectedOptions.map(opt => opt.value)
            : '';

        onChange({
            target: {
                id: id || "",
                value: eventValue,
            },
        } as any);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Size classes
    const sizeClasses = {
        sm: "text-xs px-3 py-1.5 text-sm min-h-[32px]",
        md: "text-sm px-4 py-2 text-base min-h-[40px]",
        lg: "text-base px-4 py-3 text-lg min-h-[48px]",
    };

    const getDisplayText = () => {
        if (selectedOptions.length === 0) return placeholder;

        if (!multiple) {
            return selectedOptions[0]?.label || selectedOptions[0]?.value;
        }

        if (showSelectedCount && selectedOptions.length > 2) {
            return `${selectedOptions.length} items selected`;
        }

        if (selectedOptions.length <= 2) {
            return selectedOptions.map(opt => opt.label || opt.value).join(', ');
        }

        return `${selectedOptions[0]?.label || selectedOptions[0]?.value} +${selectedOptions.length - 1} more`;
    };

    const isOptionSelected = (option: SelectOption) => {
        return selectedOptions.some(selected => selected.value === option.value);
    };

    return (
        <div ref={selectRef} className={`${fullWidth ? "w-full" : "w-fit"} mb-4`}>
            {label && (
                <label htmlFor={id} className='mb-1 block text-sm font-medium text-gray-700'>
                    {label}
                    {required && <span className='ml-1 text-red-500'>*</span>}
                </label>
            )}

            <div className='relative'>
                <button
                    type='button'
                    className={`flex items-center justify-between rounded-lg border ${
                        error ? "border-red-500" : "border-gray-200"
                    } bg-gray-100 shadow-sm ${
                        sizeClasses[size]
                    } text-gray-700 hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                        disabled ? "cursor-not-allowed bg-gray-50 opacity-50" : ""
                    } ${className} ${fullWidth ? "w-full" : ""} transition-all duration-200`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    id={id}
                    aria-haspopup='listbox'
                    aria-expanded={isOpen}
                >
                    <div className="flex-1 flex items-center gap-1 min-w-0">
                        {multiple && selectedOptions.length > 0 ? (
                            <div className="flex flex-wrap gap-1 flex-1">
                                {selectedOptions.slice(0, 3).map((option) => (
                                    <span
                                        key={option.value}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-800 text-sm rounded-md"
                                    >
                                        <span className="truncate max-w-[120px]">
                                            {option.label || option.value}
                                        </span>
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-primary-900"
                                            onClick={(e) => removeOption(option, e)}
                                        />
                                    </span>
                                ))}
                                {selectedOptions.length > 3 && (
                                    <span className="text-sm text-gray-500 px-1">
                                        +{selectedOptions.length - 3} more
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className={`truncate ${selectedOptions.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                                {getDisplayText()}
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        className={`ml-2 h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                            isOpen ? "rotate-180 transform" : ""
                        }`}
                    />
                </button>

                {isOpen && (
                    <div
                        className='absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg'
                        role='listbox'
                    >
                        {searchable && (
                            <div className='sticky top-0 border-b border-gray-100 bg-white p-3'>
                                <input
                                    type='text'
                                    className='w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200'
                                    placeholder='Search...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className='max-h-60 overflow-auto py-1'>
                            {filteredOptions.length > 0 ? (
                                <>
                                    {multiple && selectedOptions.length > 0 && (
                                        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                                            {selectedOptions.length} selected
                                            {maxSelected && ` of ${maxSelected} max`}
                                        </div>
                                    )}
                                    {filteredOptions.map((option) => {
                                        const isSelected = isOptionSelected(option);
                                        const isDisabled = option.disabled || (maxSelected && !isSelected && selectedOptions.length >= maxSelected);

                                        return (
                                            <div
                                                key={option.value}
                                                className={`cursor-pointer px-3 py-2 flex items-center justify-between transition-colors duration-150 ${
                                                    isSelected
                                                        ? "bg-primary-50 text-primary-700"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                } ${
                                                    isDisabled
                                                        ? "cursor-not-allowed text-gray-400 hover:bg-white opacity-50"
                                                        : ""
                                                }`}
                                                onClick={() => !isDisabled && handleSelect(option)}
                                                role='option'
                                                aria-selected={isSelected}
                                                aria-disabled={isDisabled as boolean}
                                            >
                                                <span className="flex-1 text-sm font-medium">
                                                    {option.label || option.value}
                                                </span>
                                                {multiple && isSelected && (
                                                    <div className="w-4 h-4 bg-primary-500 rounded-sm flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <div className='px-3 py-2 text-gray-500 text-center'>No options found</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
            {helpText && !error && <p className='mt-1 text-sm text-gray-500'>{helpText}</p>}

            {name && (
                <>
                    {multiple ? (
                        selectedOptions.map((option, index) => (
                            <input
                                key={`${option.value}-${index}`}
                                type='hidden'
                                name={`${name}[]`}
                                value={option.value}
                            />
                        ))
                    ) : (
                        <input type='hidden' name={name} value={selectedOptions[0]?.value || ""} />
                    )}
                </>
            )}
        </div>
    );
}