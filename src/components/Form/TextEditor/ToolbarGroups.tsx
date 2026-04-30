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
} from "lucide-react";

import { ToolbarButton } from "./toolbar";

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
    const ref = React.useRef<HTMLDivElement | null>(null);
    const inTable = editor.isActive("table");

    React.useEffect(() => {
        if (!open) return;
        const onDown = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) setOpen(false);
        };
        const onEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("mousedown", onDown);
        window.addEventListener("keydown", onEsc);
        return () => {
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("keydown", onEsc);
        };
    }, [open]);

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
                <div className="absolute left-1/2 z-10 mt-2 w-56 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                    <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100" onClick={() => run(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}><Table2 size={14} /> Insert table</button>
                    <button type="button" disabled={!inTable} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => run(() => editor.chain().focus().addRowAfter().run())}><Rows3 size={14} /> Add row</button>
                    <button type="button" disabled={!inTable} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => run(() => editor.chain().focus().deleteRow().run())}><Trash2 size={14} /> Delete row</button>
                    <button type="button" disabled={!inTable} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}><Columns3 size={14} /> Add column</button>
                    <button type="button" disabled={!inTable} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => run(() => editor.chain().focus().deleteColumn().run())}><TableProperties size={14} /> Delete column</button>
                    <button type="button" disabled={!inTable} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => run(() => editor.chain().focus().mergeOrSplit().run())}><Split size={14} /> Merge/Split cells</button>
                    <button type="button" disabled={!inTable} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => run(() => editor.chain().focus().deleteTable().run())}><Trash2 size={14} /> Delete table</button>
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

export const AlignmentTools: React.FC<{ editor: Editor }> = ({ editor }) => (
    <>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} ariaPressed={editor.isActive({ textAlign: "left" })} title="Align left"><AlignLeft size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} ariaPressed={editor.isActive({ textAlign: "center" })} title="Align center"><AlignCenter size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} ariaPressed={editor.isActive({ textAlign: "right" })} title="Align right"><AlignRight size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} ariaPressed={editor.isActive({ textAlign: "justify" })} title="Justify"><AlignJustify size={16} /></ToolbarButton>
    </>
);
