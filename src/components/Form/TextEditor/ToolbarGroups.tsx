import React from "react";
import type { Editor } from "@tiptap/react";
import {
    Bold as BoldIcon,
    Italic as ItalicIcon,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Code as CodeIcon,
    FileCode,
    Strikethrough,
    Quote,
    Minus,
    Undo2,
    Redo2,
    Table2,
    Rows3,
    Columns3,
    TableProperties,
    Split,
    Trash2,
    ListTodo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    ChevronDown,
} from "lucide-react";

import { ToolbarButton } from "./toolbar";

const menuSurfaceClassName =
    "absolute left-1/2 z-20 mt-2 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-2 text-gray-700 shadow-xl shadow-gray-900/10 ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:shadow-black/30 dark:ring-white/10";

const menuItemClassName =
    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800";

const tableGridSize = 6;

const useDismissiblePopover = (
    open: boolean,
    ref: React.RefObject<HTMLElement>,
    onClose: () => void,
) => {
    React.useEffect(() => {
        if (!open) return;

        const onDown = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) onClose();
        };
        const onEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("mousedown", onDown);
        window.addEventListener("keydown", onEsc);
        return () => {
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("keydown", onEsc);
        };
    }, [onClose, open, ref]);
};

export const HistoryTools: React.FC<{ editor: Editor }> = ({ editor }) => (
    <>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo2 size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo2 size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear formatting"><Minus size={16} /></ToolbarButton>
    </>
);

export const FormattingTools: React.FC<{ editor: Editor }> = ({ editor }) => (
    <>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} ariaPressed={editor.isActive("bold")} title="Bold"><BoldIcon size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} ariaPressed={editor.isActive("italic")} title="Italic"><ItalicIcon size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} ariaPressed={editor.isActive("underline")} title="Underline"><UnderlineIcon size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} ariaPressed={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={16} /></ToolbarButton>
    </>
);

export const ListTools: React.FC<{ editor: Editor }> = ({ editor }) => (
    <>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} ariaPressed={editor.isActive("bulletList")} title="Bullet list"><List size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} ariaPressed={editor.isActive("orderedList")} title="Numbered list"><ListOrdered size={16} /></ToolbarButton>
    </>
);

export const CodeTools: React.FC<{ editor: Editor }> = ({ editor }) => (
    <>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} ariaPressed={editor.isActive("code")} title="Inline code"><CodeIcon size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} ariaPressed={editor.isActive("codeBlock")} title="Code block"><FileCode size={16} /></ToolbarButton>
    </>
);

export const QuoteTools: React.FC<{ editor: Editor }> = ({ editor }) => (
    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} ariaPressed={editor.isActive("blockquote")} title="Quote"><Quote size={16} /></ToolbarButton>
);

export const TableTools: React.FC<{ editor: Editor }> = ({ editor }) => {
    const [open, setOpen] = React.useState(false);
    const [hoveredSize, setHoveredSize] = React.useState({ rows: 3, cols: 3 });
    const ref = React.useRef<HTMLDivElement | null>(null);
    const inTable = editor.isActive("table");
    const close = React.useCallback(() => setOpen(false), []);

    useDismissiblePopover(open, ref, close);

    const run = (action: () => void) => {
        action();
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <ToolbarButton onClick={() => setOpen((prev) => !prev)} title="Table actions" active={inTable} ariaPressed={open}>
                <Table2 size={16} />
            </ToolbarButton>
            {open && (
                <div className={`${menuSurfaceClassName} w-64`}>
                    <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Insert table</span>
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                            {hoveredSize.rows} x {hoveredSize.cols}
                        </span>
                    </div>
                    <div className="grid grid-cols-6 gap-1 px-1 pb-2">
                        {Array.from({ length: tableGridSize }).map((_, rowIndex) =>
                            Array.from({ length: tableGridSize }).map((__, colIndex) => {
                                const rows = rowIndex + 1;
                                const cols = colIndex + 1;
                                const selected = rows <= hoveredSize.rows && cols <= hoveredSize.cols;

                                return (
                                    <button
                                        key={`${rows}-${cols}`}
                                        type="button"
                                        className={`h-7 rounded-md border transition-colors ${
                                            selected
                                                ? "border-primary-500 bg-primary-500/20 dark:bg-primary-500/25"
                                                : "border-gray-200 bg-gray-50 hover:border-primary-400 dark:border-gray-700 dark:bg-gray-950"
                                        }`}
                                        title={`Insert ${rows} x ${cols} table`}
                                        aria-label={`Insert ${rows} x ${cols} table`}
                                        onMouseEnter={() => setHoveredSize({ rows, cols })}
                                        onFocus={() => setHoveredSize({ rows, cols })}
                                        onClick={() => run(() => editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run())}
                                    />
                                );
                            }),
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
                        <button type="button" disabled={!inTable} className={menuItemClassName} onClick={() => run(() => editor.chain().focus().addRowAfter().run())}><Rows3 size={14} /> Add row</button>
                        <button type="button" disabled={!inTable} className={menuItemClassName} onClick={() => run(() => editor.chain().focus().deleteRow().run())}><Trash2 size={14} /> Delete row</button>
                        <button type="button" disabled={!inTable} className={menuItemClassName} onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}><Columns3 size={14} /> Add column</button>
                        <button type="button" disabled={!inTable} className={menuItemClassName} onClick={() => run(() => editor.chain().focus().deleteColumn().run())}><TableProperties size={14} /> Delete column</button>
                        <button type="button" disabled={!inTable} className={menuItemClassName} onClick={() => run(() => editor.chain().focus().mergeOrSplit().run())}><Split size={14} /> Merge/Split cells</button>
                        <button type="button" disabled={!inTable} className={`${menuItemClassName} text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40`} onClick={() => run(() => editor.chain().focus().deleteTable().run())}><Trash2 size={14} /> Delete table</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const InsertTools: React.FC<{ editor: Editor }> = ({ editor }) => (
    <>
        <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} ariaPressed={editor.isActive("taskList")} title="Task list"><ListTodo size={16} /></ToolbarButton>
    </>
);

const alignments = [
    { value: "left", label: "Align left", icon: AlignLeft },
    { value: "center", label: "Align center", icon: AlignCenter },
    { value: "right", label: "Align right", icon: AlignRight },
    { value: "justify", label: "Justify", icon: AlignJustify },
] as const;

export const AlignmentTools: React.FC<{ editor: Editor }> = ({ editor }) => {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement | null>(null);
    const activeAlignment = alignments.find((alignment) => editor.isActive({ textAlign: alignment.value })) ?? alignments[0];
    const ActiveIcon = activeAlignment.icon;
    const close = React.useCallback(() => setOpen(false), []);

    useDismissiblePopover(open, ref, close);

    return (
        <div className="relative" ref={ref}>
            <ToolbarButton onClick={() => setOpen((prev) => !prev)} active={open} ariaPressed={open} title={activeAlignment.label} className="gap-1">
                <ActiveIcon size={16} />
                <ChevronDown size={12} />
            </ToolbarButton>
            {open && (
                <div className={`${menuSurfaceClassName} w-44`}>
                    {alignments.map((alignment) => {
                        const Icon = alignment.icon;
                        const active = editor.isActive({ textAlign: alignment.value });

                        return (
                            <button
                                key={alignment.value}
                                type="button"
                                className={`${menuItemClassName} ${active ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300" : ""}`}
                                onClick={() => {
                                    editor.chain().focus().setTextAlign(alignment.value).run();
                                    setOpen(false);
                                }}
                            >
                                <Icon size={14} /> {alignment.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
