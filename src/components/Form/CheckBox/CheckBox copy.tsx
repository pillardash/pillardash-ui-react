import { ReactNode, useEffect, useState } from "react";

export type CheckBoxProps = {
  variant?: "check" | "dot" | "toggle";
  size?: "sm" | "md" | "lg";
  checked?: boolean;
  disabled?: boolean;
  onChange?:
    | ((checked: boolean) => void)
    | ((e: React.ChangeEvent<HTMLInputElement>) => void);
  label?: string | ReactNode;
  labelPosition?: "left" | "right";
  name?: string;
  value?: string;
  id?: string;
  className?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  indeterminate?: boolean;
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
  helpText?: string;
  required?: boolean;
  label?: string;
  direction?: "horizontal" | "vertical";
};

const CheckBox = ({
  variant = "check",
  size = "md",
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
  helpText,
  required = false,
  indeterminate = false,
}: CheckBoxProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [isIndeterminate, setIsIndeterminate] = useState(indeterminate);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    setIsIndeterminate(indeterminate);
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.checked;
    setIsChecked(newValue);
    setIsIndeterminate(false);

    // Support both callback patterns
    if (onChange) {
      // Try calling with event first, if it fails (expecting boolean), call with boolean
      try {
        (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e);
      } catch {
        (onChange as (checked: boolean) => void)(newValue);
      }
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      container: "h-4 w-4",
      toggle: "w-7 h-4",
      toggleCircle: "h-3 w-3",
      text: "text-sm",
    },
    md: {
      container: "h-5 w-5",
      toggle: "w-9 h-5",
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

  const renderCheckBox = () => {
    if (variant === "toggle") {
      return (
        <label
          htmlFor={checkboxId}
          className={`relative inline-block rounded-full transition-colors duration-200 ${sizeClasses[size].toggle} ${
            isChecked ? "bg-primary" : "bg-gray-300"
          } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    ${error ? "ring-2 ring-red-300" : ""}`}
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
        </label>
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
        <label
          htmlFor={checkboxId}
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
        >
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

          {isIndeterminate && variant === "check" && (
            <div className="h-0.5 w-2.5 bg-white rounded-full" />
          )}

          {isChecked && variant === "dot" && (
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          )}
        </label>
      </div>
    );
  };

  return (
    <div>
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
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

const RadioGroup = ({
  name,
  value,
  onChange,
  options,
  size = "md",
  className = "",
  error,
  helpText,
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

      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
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
    mandatory: false,
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
                helpText="Select one option from the list"
              />

              {/* Horizontal Radio Group */}
              <RadioGroup
                name="demo-radio-horizontal"
                value={selectedValue}
                onChange={setSelectedValue}
                label="Horizontal Layout"
                direction="horizontal"
                options={[
                  { value: "option1", label: "Yes" },
                  { value: "option2", label: "No" },
                  { value: "option3", label: "Maybe" },
                ]}
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

            {/* Form sample with both callback patterns */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium">
                Sample Form - Flexible onChange API
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Supports both{" "}
                <code className="bg-gray-100 px-1 rounded">
                  e.target.checked
                </code>{" "}
                and direct boolean value
              </p>
              <div className="space-y-4">
                {/* Pattern 1: Using e.target.checked */}
                <CheckBox
                  variant="check"
                  checked={formData.terms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, terms: e.target.checked })
                  }
                  label="I accept the terms and conditions (using e.target.checked)"
                  required
                  error={
                    !formData.terms ? "Please accept terms to continue" : ""
                  }
                />

                {/* Pattern 2: Using boolean value directly */}
                <CheckBox
                  variant="toggle"
                  checked={formData.newsletter}
                  onChange={(checked: boolean) =>
                    setFormData({ ...formData, newsletter: checked })
                  }
                  label="Subscribe to newsletter (using boolean value)"
                  helpText="Get updates about new features and releases"
                />

                {/* Pattern 2: Simple boolean */}
                <CheckBox
                  variant="check"
                  checked={formData.notifications}
                  onChange={(checked: boolean) =>
                    setFormData({ ...formData, notifications: checked })
                  }
                  label="Enable push notifications"
                />

                {/* Pattern 1: Event object */}
                <CheckBox
                  variant="check"
                  checked={formData.mandatory}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, mandatory: e.target.checked })
                  }
                  label="Mandatory Fee (using event)"
                  helpText="Students must pay this fee"
                />

                <div className="pt-4">
                  <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.terms}
                  >
                    Submit
                  </button>
                </div>

                {/* State Display */}
                <div className="mt-4 rounded bg-gray-100 p-4">
                  <h4 className="font-medium text-sm mb-2">
                    Current Form State:
                  </h4>
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Label Position Demo */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium">Label Position</h3>
              <div className="space-y-3">
                <CheckBox
                  variant="check"
                  label="Label on the right (default)"
                  labelPosition="right"
                />
                <CheckBox
                  variant="check"
                  label="Label on the left"
                  labelPosition="left"
                />
              </div>
            </div>

            {/* Error States */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium">Error States</h3>
              <div className="space-y-3">
                <CheckBox
                  variant="check"
                  label="Checkbox with error"
                  error="This field is required"
                />
                <RadioGroup
                  name="error-demo"
                  label="Radio group with error"
                  options={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                  ]}
                  error="Please select an option"
                />
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
