import React, {useState, useRef, useEffect, useMemo} from "react";

export interface Tag {
    value: string;
    label: string;
}

export interface TagInputProps {
    id?: string;
    label?: string;
    value: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    helpText?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    predefinedTags?: Tag[];
    tagBackgroundColor?: string;
    tagTextColor?: string;
    maxTags?: number;
    allowCustomTags?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
                                               id,
                                               label,
                                               value = [],
                                               size = "md",
                                               onChange,
                                               placeholder = "Type to search or add tags...",
                                               error,
                                               required = false,
                                               helpText,
                                               className = "",
                                               disabled = false,
                                               predefinedTags = [],
                                               tagBackgroundColor = "bg-primary",
                                               tagTextColor = "text-white",
                                               maxTags,
                                               allowCustomTags = true,
                                               ...restProps
                                           }) => {
    const [inputValue, setInputValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: "text-xs px-3 py-1.5 text-sm min-h-[32px]",
        md: "text-sm px-4 py-2 text-base min-h-[40px]",
        lg: "text-base px-4 py-3 text-lg min-h-[48px]",
    };

    const tagSizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2 py-1",
        lg: "text-base px-3 py-1.5",
    };

    const filteredTags = useMemo(() => {
        if (!inputValue) {
            return predefinedTags.filter(tag =>
                !value.some(selectedTag => selectedTag === tag.value)
            );
        }

        return predefinedTags.filter(tag =>
            tag.label.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.some(selectedTag => selectedTag === tag.value)
        );
    }, [inputValue, predefinedTags, value]);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsDropdownOpen(true);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue.trim());
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            // Remove last tag when backspace is pressed and input is empty
            removeTag(value[value.length - 1]);
        } else if (e.key === "Escape") {
            setIsDropdownOpen(false);
            setInputValue("");
        }
    };

    const addTag = (tagValue: string) => {
        if (!tagValue || (maxTags && value.length >= maxTags)) return;

        // Check if tag already exists
        const existingTag = value.find(tag => tag.toLowerCase() === tagValue.toLowerCase());
        if (existingTag) return;

        // Check if it's a predefined tag
        const predefinedTag = predefinedTags.find(tag =>
            tag.label.toLowerCase() === tagValue.toLowerCase() ||
            tag.value.toLowerCase() === tagValue.toLowerCase()
        );

        let newTag: string;
        if (predefinedTag) {
            newTag = predefinedTag.value;
        } else if (allowCustomTags) {
            newTag = tagValue;
        } else {
            return; // Don't add if custom tags aren't allowed
        }

        const newTags = [...value, newTag];
        onChange?.(newTags);
        setInputValue("");
        setIsDropdownOpen(false);
    };

    const removeTag = (tagId: string) => {
        const newTags = value.filter(tag => tag !== tagId);
        onChange?.(newTags);
    };

    const selectPredefinedTag = (tag: Tag) => {
        addTag(tag.value);
    };

    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-600">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="relative" ref={dropdownRef}>
                <div
                    className={`w-full rounded-[12px] border ${
                        error ? "border-red-500" : "border-gray-200"
                    } ${
                        disabled
                            ? "bg-gray-100 text-gray-500"
                            : "bg-gray-100 text-dark"
                    } focus-within:outline-none focus-within:ring-1 focus-within:ring-primary ${className} ${sizeClasses[size]} flex flex-wrap items-center gap-1`}
                >
                    {/* Render selected tags */}
                    {value.map((tag) => (
                        <span
                            key={tag}
                            className={`inline-flex items-center rounded-full ${tagBackgroundColor} ${tagTextColor} ${tagSizeClasses[size]} font-medium`}
                        >
                            {tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black hover:bg-opacity-20"
                                >
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            )}
                        </span>
                    ))}

                    {/* Input field */}
                    <input
                        ref={inputRef}
                        id={id}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus}
                        placeholder={value.length === 0 ? placeholder : ""}
                        disabled={disabled || (maxTags && value.length >= maxTags) as boolean}
                        className="flex-1 border-none bg-transparent outline-none placeholder-gray-400 min-w-[120px]"
                        aria-invalid={!!error}
                        aria-describedby={error ? `${value}-error` : helpText ? `${value}-help` : undefined}
                    />
                </div>

                {/* Dropdown */}
                {isDropdownOpen && !disabled && (filteredTags.length > 0 || (inputValue && allowCustomTags)) && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-[12px] shadow-lg backdrop-blur-sm bg-white/95 max-h-60 overflow-auto p-4">
                        {/* Predefined tags */}
                        {filteredTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {filteredTags.map((tag) => (
                                    <button
                                        key={tag.value}
                                        type="button"
                                        onClick={() => selectPredefinedTag(tag)}
                                        className={`inline-flex items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 ${tagSizeClasses[size]} font-medium`}
                                    >
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Custom tag option */}
                        {inputValue && allowCustomTags && !predefinedTags.some(tag =>
                            tag.label.toLowerCase() === inputValue.toLowerCase()
                        ) && (
                            <>
                                {filteredTags.length > 0 && (
                                    <div className="border-t border-gray-100 pt-3 mb-2">
                                        <span className="text-xs text-gray-500 font-medium">CREATE NEW TAG</span>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => addTag(inputValue)}
                                        className={`inline-flex items-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 ${tagSizeClasses[size]} font-medium border border-blue-200`}
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        {inputValue}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Empty state */}
                        {filteredTags.length === 0 && (!inputValue || !allowCustomTags) && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                No matching tags found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {maxTags && (
                <div className="mt-1 text-xs text-gray-500">
                    {value.length}/{maxTags} tags
                </div>
            )}

            {helpText && !error && (
                <p id={`${value}-help`} className="mt-1 text-sm text-gray-500">
                    {helpText}
                </p>
            )}

            {error && (
                <p id={`${value}-error`} className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

// Demo component to show usage
export const TagInputDemo = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedTags2, setSelectedTags2] = useState<string[]>([]);

    const predefinedTags: Tag[] = [
        {  label: "React", value: "react" },
        {  label: "JavaScript", value: "javascript" },
        {  label: "TypeScript", value: "typescript" },
        {  label: "Node.js", value: "nodejs" },
        {  label: "Python", value: "python" },
        {  label: "CSS", value: "css" },
        {  label: "HTML", value: "html" },
        {  label: "Vue.js", value: "vuejs" },
        {  label: "Angular", value: "angular" },
        { label: "Next.js", value: "nextjs" },
    ];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">TagInput Component Demo</h1>

            <div className="space-y-8">
                <TagInput
                    id="skills"
                    label="Skills & Technologies"
                    value={selectedTags}
                    onChange={setSelectedTags}
                    predefinedTags={predefinedTags}
                    placeholder="Search or add skills..."
                    helpText="Select from predefined options or add your own custom tags"
                    size="md"
                />

                <TagInput
                    id="custom-tags"
                    label="Project Categories (Custom Colors)"
                    value={selectedTags2}
                    onChange={setSelectedTags2}
                    predefinedTags={[
                        { label: "Web Development", value: "web" },
                        { label: "Mobile App", value: "mobile" },
                        { label: "AI/ML", value: "ai" },
                        { label: "UI/UX Design", value: "design" },
                    ]}
                    placeholder="Add project categories..."
                    tagBackgroundColor="bg-purple-500"
                    tagTextColor="text-white"
                    maxTags={5}
                    size="lg"
                    helpText="Maximum 5 tags allowed with custom purple styling"
                />

                <div className="mt-8 p-4 bg-white rounded-lg border">
                    <h3 className="font-medium mb-2">Selected Skills:</h3>
                    <pre className="text-sm bg-gray-100 p-2 rounded">
                        {JSON.stringify(selectedTags, null, 2)}
                    </pre>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                    <h3 className="font-medium mb-2">Selected Categories:</h3>
                    <pre className="text-sm bg-gray-100 p-2 rounded">
                        {JSON.stringify(selectedTags2, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default TagInput;