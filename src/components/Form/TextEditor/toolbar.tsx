import React from "react";
import { SeparatorVertical } from "lucide-react";

export type HeadingLevel = 0 | 1 | 2 | 3;

export const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  ariaPressed?: boolean;
}> = ({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
  ariaPressed,
}) => (
  <button
    onClick={onClick}
    className={`rounded p-2 transition-colors ${active ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-200 dark:hover:bg-gray-800"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    type="button"
    disabled={disabled}
    title={title}
    aria-label={title}
    aria-pressed={ariaPressed}
  >
    {children}
  </button>
);

export const ToolbarDivider = () => (
  <SeparatorVertical className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-700" />
);

export const HeadingSelect: React.FC<{
  value: HeadingLevel;
  onChange: (value: HeadingLevel) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <select
      className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      aria-label="Heading level"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) as HeadingLevel)}
    >
      <option value={0}>Normal</option>
      <option value={1} className="text-2xl">
        Heading 1
      </option>
      <option value={2} className="text-xl">
        Heading 2
      </option>
      <option value={3} className="text-lg">
        Heading 3
      </option>
    </select>
  </div>
);
