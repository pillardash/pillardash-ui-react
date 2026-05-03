import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Loader2 } from "lucide-react";

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

  // NEW: Backend search props
  onSearch?: (searchTerm: string) => void | Promise<void>;
  isSearching?: boolean;
  searchDebounceMs?: number;

  multiple?: boolean;
  maxSelected?: number;
  showSelectedCount?: boolean;
  closeOnSelect?: boolean;
  showSelectAll?: boolean;
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
  onSearch,
  isSearching = false,
  searchDebounceMs = 300,
  multiple = false,
  maxSelected,
  showSelectedCount = false,
  closeOnSelect,
  showSelectAll = true,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom",
  );

  const shouldCloseOnSelect =
    closeOnSelect !== undefined ? closeOnSelect : !multiple;

  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(() => {
    if (!value) return [];

    if (multiple && Array.isArray(value)) {
      return value
        .map((val) => options.find((option) => option.value == val))
        .filter(Boolean) as SelectOption[];
    } else if (!multiple) {
      const option = options.find((option) => option.value == value);
      return option ? [option] : [];
    }
    return [];
  });

  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      setSelectedOptions(
        value
          .map((val) => options.find((option) => option.value == val))
          .filter(Boolean) as SelectOption[],
      );
    } else if (!multiple) {
      const option = options.find((option) => option.value == value);
      setSelectedOptions(option ? [option] : []);
    } else if (value === "" || value === null || value == undefined) {
      setSelectedOptions([]);
    }
  }, [value, options, multiple]);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 250;
      const spaceBelow = viewportHeight - selectRect.bottom;
      const spaceAbove = selectRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  // Handle search with debouncing
  useEffect(() => {
    if (!onSearch || !searchTerm) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(searchTerm);
    }, searchDebounceMs);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, onSearch, searchDebounceMs]);

  // Filter options based on search term if using client-side search
  const filteredOptions =
    searchable && !onSearch
      ? options.filter((option) =>
          (option.label || option.value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        )
      : options;

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    let newSelectedOptions: SelectOption[];

    if (multiple) {
      const isAlreadySelected = selectedOptions.some(
        (selected) => selected.value === option.value,
      );

      if (isAlreadySelected) {
        newSelectedOptions = selectedOptions.filter(
          (selected) => selected.value !== option.value,
        );
      } else {
        if (maxSelected && selectedOptions.length >= maxSelected) {
          return;
        }
        newSelectedOptions = [...selectedOptions, option];
      }
    } else {
      newSelectedOptions = [option];
    }

    setSelectedOptions(newSelectedOptions);

    const eventValue = multiple
      ? newSelectedOptions.map((opt) => opt.value)
      : newSelectedOptions[0]?.value || "";

    onChange({
      target: {
        id: id || "",
        value: eventValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>);

    if (shouldCloseOnSelect) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleSelectAll = () => {
    if (!multiple) return;

    const selectableOptions = filteredOptions.filter((opt) => !opt.disabled);
    const allSelected = selectableOptions.every((option) =>
      selectedOptions.some((selected) => selected.value === option.value),
    );

    let newSelectedOptions: SelectOption[];

    if (allSelected) {
      newSelectedOptions = selectedOptions.filter(
        (selected) =>
          !selectableOptions.some((option) => option.value === selected.value),
      );
    } else {
      const optionsToAdd = selectableOptions.filter(
        (option) =>
          !selectedOptions.some((selected) => selected.value === option.value),
      );

      if (maxSelected !== undefined) {
        const remainingSlots = maxSelected - selectedOptions.length;
        newSelectedOptions = [
          ...selectedOptions,
          ...optionsToAdd.slice(0, remainingSlots),
        ];
      } else {
        newSelectedOptions = [...selectedOptions, ...optionsToAdd];
      }
    }

    setSelectedOptions(newSelectedOptions);

    const eventValue = newSelectedOptions.map((opt) => opt.value);

    onChange({
      target: {
        id: id || "",
        value: eventValue,
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleClearAll = () => {
    if (!multiple) return;

    setSelectedOptions([]);

    onChange({
      target: {
        id: id || "",
        value: [],
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const removeOption = (optionToRemove: SelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedOptions = selectedOptions.filter(
      (option) => option.value !== optionToRemove.value,
    );
    setSelectedOptions(newSelectedOptions);

    const eventValue = multiple
      ? newSelectedOptions.map((opt) => opt.value)
      : "";

    onChange({
      target: {
        id: id || "",
        value: eventValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      return selectedOptions.map((opt) => opt.label || opt.value).join(", ");
    }

    return `${selectedOptions[0]?.label || selectedOptions[0]?.value} +${selectedOptions.length - 1} more`;
  };

  const isOptionSelected = (option: SelectOption) => {
    return selectedOptions.some((selected) => selected.value === option.value);
  };

  const areAllFilteredSelected = () => {
    if (!multiple || filteredOptions.length === 0) return false;
    const selectableOptions = filteredOptions.filter((opt) => !opt.disabled);
    return (
      selectableOptions.length > 0 &&
      selectableOptions.every((option) =>
        selectedOptions.some((selected) => selected.value === option.value),
      )
    );
  };

  const areSomeFilteredSelected = () => {
    if (!multiple || filteredOptions.length === 0) return false;
    const selectableOptions = filteredOptions.filter((opt) => !opt.disabled);
    return (
      selectableOptions.some((option) =>
        selectedOptions.some((selected) => selected.value === option.value),
      ) && !areAllFilteredSelected()
    );
  };

  const dropdownPositionClasses =
    dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <div ref={selectRef} className={`${fullWidth ? "w-full" : "w-fit"} mb-4`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          className={`flex items-center justify-between rounded-lg border ${
            error ? "border-red-500" : "border-gray-200 dark:border-gray-700"
          } bg-gray-100 shadow-sm dark:bg-gray-800 ${
            sizeClasses[size]
          } text-gray-700 hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-gray-200 dark:hover:border-gray-600 ${
            disabled ? "cursor-not-allowed bg-gray-50 opacity-50 dark:bg-gray-700" : ""
          } ${className} ${fullWidth ? "w-full" : ""} transition-all duration-200`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          id={id}
          aria-haspopup="listbox"
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
                  <span className="px-1 text-sm text-gray-500 dark:text-gray-400">
                    +{selectedOptions.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <span
                className={`truncate ${selectedOptions.length === 0 ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-200"}`}
              >
                {getDisplayText()}
              </span>
            )}
          </div>
          <ChevronDown
            className={`ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform dark:text-gray-500 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`absolute z-[9999] w-full rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 ${dropdownPositionClasses}`}
            role="listbox"
            style={{
              zIndex: 9999,
              position: "absolute",
            }}
          >
            {searchable && (
              <div className="sticky top-0 z-[10000] border-b border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    placeholder={onSearch ? "Search..." : "Filter..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-auto py-1">
              {isSearching ? (
                <div className="px-3 py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Searching...</p>
                </div>
              ) : filteredOptions.length > 0 ? (
                <>
                  {multiple && showSelectAll && (
                    <div className="border-b border-gray-100 dark:border-gray-700">
                      <div className="px-3 py-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {areAllFilteredSelected()
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                        {selectedOptions.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      {selectedOptions.length > 0 && (
                        <div className="px-3 pb-2 text-xs text-gray-500 dark:text-gray-400">
                          {selectedOptions.length} selected
                          {maxSelected && ` of ${maxSelected} max`}
                        </div>
                      )}
                    </div>
                  )}
                  {filteredOptions.map((option) => {
                    const isSelected = isOptionSelected(option);
                    const isDisabled =
                      option.disabled ||
                      (maxSelected !== undefined &&
                        !isSelected &&
                        selectedOptions.length >= maxSelected);

                    return (
                      <div
                        key={option.value}
                        className={`cursor-pointer px-3 py-2 flex items-center justify-between transition-colors duration-150 ${
                          isSelected
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                        } ${
                          isDisabled
                            ? "cursor-not-allowed text-gray-400 opacity-50 hover:bg-white dark:text-gray-500 dark:hover:bg-gray-800"
                            : ""
                        }`}
                        onClick={() => !isDisabled && handleSelect(option)}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={isDisabled}
                      >
                        <span className="flex-1 text-sm font-medium">
                          {option.label || option.value}
                        </span>
                        {multiple && isSelected && (
                          <div className="w-4 h-4 bg-primary-500 rounded-sm flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? "No results found" : "No options available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}

      {name && (
        <>
          {multiple ? (
            selectedOptions.map((option, index) => (
              <input
                key={`${option.value}-${index}`}
                type="hidden"
                name={`${name}[]`}
                value={option.value}
              />
            ))
          ) : (
            <input
              type="hidden"
              name={name}
              value={selectedOptions[0]?.value || ""}
            />
          )}
        </>
      )}
    </div>
  );
}

// Demo Component
function Demo() {
  const [selectedValue, setSelectedValue] = useState("");
  const [options, setOptions] = useState([
    { value: "1", label: "Apple" },
    { value: "2", label: "Banana" },
    { value: "3", label: "Cherry" },
  ]);
  const [isSearching, setIsSearching] = useState(false);

  const handleBackendSearch = async (searchTerm: string) => {
    console.log("Searching backend for:", searchTerm);
    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock backend filtering
    const allFruits = [
      { value: "1", label: "Apple" },
      { value: "2", label: "Banana" },
      { value: "3", label: "Cherry" },
      { value: "4", label: "Date" },
      { value: "5", label: "Elderberry" },
      { value: "6", label: "Fig" },
      { value: "7", label: "Grape" },
      { value: "8", label: "Honeydew" },
    ];

    const filtered = searchTerm
      ? allFruits.filter((fruit) =>
          fruit.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : allFruits;

    setOptions(filtered);
    setIsSearching(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Select with Backend Search</h1>
        <p className="text-gray-600">
          Type in the search box to trigger backend filtering (simulated with
          800ms delay)
        </p>
      </div>

      <Select
        label="Choose a fruit"
        placeholder="Select or search for a fruit"
        options={options}
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value as string)}
        searchable={true}
        onSearch={handleBackendSearch}
        isSearching={isSearching}
        searchDebounceMs={300}
      />

      {selectedValue && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            Selected value: {selectedValue}
          </p>
        </div>
      )}
    </div>
  );
}
