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
  className?: string;
}> = ({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
  ariaPressed,
  className = "",
}) => (
  <button
    onClick={onClick}
    className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-1 focus:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus:ring-offset-gray-950 ${active ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300" : ""} ${disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""} ${className}`.trim()}
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
  <SeparatorVertical className="mx-1 h-5 w-px bg-gray-200 text-transparent dark:bg-gray-800" />
);

export const HeadingSelect: React.FC<{
  value: HeadingLevel;
  onChange: (value: HeadingLevel) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <select
      className="h-8 rounded-md border-0 bg-transparent px-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-primary-500/30 dark:text-gray-200 dark:hover:bg-gray-800"
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
