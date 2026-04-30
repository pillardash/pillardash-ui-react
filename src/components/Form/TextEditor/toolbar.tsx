import React from "react";
import { Heading1, Heading2, Heading3, SeparatorVertical } from "lucide-react";

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
    className={`p-2 rounded transition-colors ${active ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
  <SeparatorVertical className="mx-2 h-6 w-px bg-gray-300" />
);

export const HeadingSelect: React.FC<{
  value: HeadingLevel;
  onChange: (value: HeadingLevel) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <select
      className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
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
    {/*<Heading1 size={14} className="text-gray-500" />
        <Heading2 size={14} className="text-gray-500" />
        <Heading3 size={14} className="text-gray-500" />*/}
  </div>
);
