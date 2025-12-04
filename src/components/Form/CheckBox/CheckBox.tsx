import { ReactNode, useEffect, useState } from "react";

export type CheckBoxProps = {
  variant?: "check" | "dot" | "toggle";
  size?: "sm" | "md" | "lg";
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string | ReactNode;
  labelPosition?: "left" | "right";
  name?: string; // For radio grouping
  value?: string; // For radio value
  id?: string;
  className?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  indeterminate?: boolean; // For partially checked state
};

export type RadioGroupProps = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{
    value: string;
    label: string | ReactNode;
    disabled?: boolean;
  }>;
  size?: "sm" | "md" | "lg";
  className?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  label?: string;
  direction?: "horizontal" | "vertical";
};

const CheckBox = ({
  variant = "check",
  size = "sm",
  checked = false,
  disabled = false,
  onChange,
  label,
  labelPosition = "right",
  name,
  value,
  id,
  className = "",
  error,
  helperText,
  required = false,
  indeterminate = false,
}: CheckBoxProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [isIndeterminate, setIsIndeterminate] = useState(indeterminate);

  // Sync internal state with props
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    setIsIndeterminate(indeterminate);
  }, [indeterminate]);

  const handleChange = () => {
    if (disabled) return;

    const newValue = !isChecked;
    setIsChecked(newValue);
    setIsIndeterminate(false);
    onChange?.(newValue);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      container: "h-4 w-4",
      toggle: "w-8 h-4",
      toggleCircle: "h-3 w-3",
      text: "text-sm",
    },
    md: {
      container: "h-5 w-5",
      toggle: "w-10 h-5",
      toggleCircle: "h-4 w-4",
      text: "text-base",
    },
    lg: {
      container: "h-6 w-6",
      toggle: "w-12 h-6",
      toggleCircle: "h-5 w-5",
      text: "text-lg",
    },
  };

  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Render different variants
  const renderCheckBox = () => {
    if (variant === "toggle") {
      return (
        <div
          className={`relative rounded-full transition-colors duration-200 ${sizeClasses[size].toggle} ${
            isChecked ? "bg-primary" : "bg-gray-300"
          } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    ${error ? "ring-2 ring-red-300" : ""}`}
          onClick={handleChange}
        >
          <div
            className={`absolute top-0.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${sizeClasses[size].toggleCircle} ${
              isChecked ? "translate-x-full" : "translate-x-0.5"
            }`}
          />
          <input
            type="checkbox"
            id={checkboxId}
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            required={required}
          />
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          type={variant === "dot" ? "radio" : "checkbox"}
          id={checkboxId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
        />
        <div
          className={`${sizeClasses[size].container} ${
            variant === "check" ? "rounded-md" : "rounded-full"
          } flex items-center justify-center border-2 transition-all duration-200 ${
            isChecked || isIndeterminate
              ? "border-primary bg-primary"
              : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white hover:border-gray-400"
          } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2`}
          onClick={handleChange}
        >
          {/* Check mark */}
          {isChecked && variant === "check" && (
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

          {/* Indeterminate state */}
          {isIndeterminate && variant === "check" && (
            <div className="h-0.5 w-2.5 bg-white rounded-full" />
          )}

          {/* Radio dot */}
          {isChecked && variant === "dot" && (
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`flex items-start gap-2 ${className}`}>
        {label && labelPosition === "left" && (
          <label
            htmlFor={checkboxId}
            className={`${sizeClasses[size].text} ${
              disabled
                ? "text-gray-400"
                : error
                  ? "text-red-600"
                  : "text-gray-700"
            } cursor-pointer select-none`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="flex flex-col">
          {renderCheckBox()}

          {/* Error message */}
          {error && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}
        </div>

        {label && labelPosition === "right" && (
          <label
            htmlFor={checkboxId}
            className={`${sizeClasses[size].text} ${
              disabled
                ? "text-gray-400"
                : error
                  ? "text-red-600"
                  : "text-gray-700"
            } cursor-pointer select-none`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </>
  );
};

// RadioGroup component for managing radio buttons
const RadioGroup = ({
  name,
  value,
  onChange,
  options,
  size = "md",
  className = "",
  error,
  helperText,
  required = false,
  label,
  direction = "vertical",
}: RadioGroupProps) => {
  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`flex ${direction === "horizontal" ? "flex-row gap-6" : "flex-col gap-2"}`}
      >
        {options.map((option) => (
          <CheckBox
            key={option.value}
            variant="dot"
            size={size}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => handleChange(option.value)}
            label={option.label}
            disabled={option.disabled}
            error={error}
            required={required}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

function CheckBoxDemo() {
  const [selectedValue, setSelectedValue] = useState("option1");
  const [formData, setFormData] = useState({
    terms: false,
    newsletter: true,
    notifications: false,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-semibold">
            CheckBox Component Demo
          </h2>

          <div className="space-y-8">
            {/* Check variant */}
            <div className="space-y-4">
              <h3 className="font-medium">Check Variant</h3>
              <div className="flex flex-wrap items-center gap-6">
                <CheckBox variant="check" size="sm" label="Small" />
                <CheckBox variant="check" size="md" checked label="Medium" />
                <CheckBox variant="check" size="lg" label="Large" />
                <CheckBox variant="check" disabled label="Disabled" />
                <CheckBox variant="check" indeterminate label="Indeterminate" />
              </div>
            </div>

            {/* Radio Group */}
            <div className="space-y-4">
              <h3 className="font-medium">Radio Group (Dot Variant)</h3>
              <RadioGroup
                name="demo-radio"
                value={selectedValue}
                onChange={setSelectedValue}
                label="Choose an option"
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" },
                  {
                    value: "option4",
                    label: "Option 4 (Disabled)",
                    disabled: true,
                  },
                ]}
                helperText="Select one option from the list"
              />
            </div>

            {/* Toggle variant */}
            <div className="space-y-4">
              <h3 className="font-medium">Toggle Variant</h3>
              <div className="flex flex-wrap items-center gap-6">
                <CheckBox variant="toggle" size="sm" label="Small" />
                <CheckBox variant="toggle" size="md" checked label="Medium" />
                <CheckBox variant="toggle" size="lg" label="Large" />
                <CheckBox variant="toggle" disabled label="Disabled" />
              </div>
            </div>

            {/* Form sample */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium">Sample Form</h3>
              <div className="space-y-4">
                <CheckBox
                  variant="check"
                  checked={formData.terms}
                  onChange={(checked) =>
                    setFormData({ ...formData, terms: checked })
                  }
                  label="I accept the terms and conditions"
                  required
                  error={
                    !formData.terms ? "Please accept terms to continue" : ""
                  }
                />

                <CheckBox
                  variant="toggle"
                  checked={formData.newsletter}
                  onChange={(checked) =>
                    setFormData({ ...formData, newsletter: checked })
                  }
                  label="Subscribe to newsletter"
                  helperText="Get updates about new features and releases"
                />

                <CheckBox
                  variant="check"
                  checked={formData.notifications}
                  onChange={(checked) =>
                    setFormData({ ...formData, notifications: checked })
                  }
                  label="Enable push notifications"
                />

                <div className="pt-4">
                  <button
                    className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                    disabled={!formData.terms}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckBox;
export { CheckBoxDemo, RadioGroup };
