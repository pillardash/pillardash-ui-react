import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import ImagePopover from "./ImagePopover";
import LinkPopover from "./LinkPopover";
import { AlignmentTools, CodeTools, FormattingTools, HistoryTools, InsertTools, ListTools, QuoteTools, TableTools } from "./ToolbarGroups";
import { createTextEditorExtensions, editorContentClassName, type TextEditorFeatures, type ToolbarPreset, toolbarPresetFeatures, withDefaultFeatures } from "./extensions";
import { HeadingLevel, HeadingSelect, ToolbarDivider } from "./toolbar";

export interface TextEditorProps {
    initialContent?: string;
    onUpdate: (content: string) => void;
    features?: TextEditorFeatures;
    stickyToolbar?: boolean;
    toolbarPreset?: ToolbarPreset;
    onImageUpload?: (file: File) => Promise<{ url: string; assetId?: string }>;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialContent = "", onUpdate, features, stickyToolbar = true, toolbarPreset = "standard", onImageUpload }) => {
    const enabledFeatures = React.useMemo(() => withDefaultFeatures({ ...toolbarPresetFeatures[toolbarPreset], ...features }), [features, toolbarPreset]);
    const [slashOpen, setSlashOpen] = React.useState(false);
    const [bubblePos, setBubblePos] = React.useState<{ top: number; left: number } | null>(null);

    const editor = useEditor({
        extensions: createTextEditorExtensions(enabledFeatures),
        content: initialContent,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: editorContentClassName,
            },
            handleKeyDown: (_view, event) => {
                if (!enabledFeatures.slashCommand) return false;
                if (event.key === "/") {
                    setSlashOpen(true);
                    return false;
                }
                if (event.key === "Escape") {
                    setSlashOpen(false);
                }
                return false;
            },
        },
        immediatelyRender: false,
    });

    React.useEffect(() => {
        if (!editor) return;
        const updateBubble = () => {
            const { from, to } = editor.state.selection;
            if (from === to || !editor.isFocused) {
                setBubblePos(null);
                return;
            }
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                setBubblePos(null);
                return;
            }
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            setBubblePos({ top: rect.top + window.scrollY - 48, left: rect.left + window.scrollX + rect.width / 2 });
        };
        const onBlur = () => setBubblePos(null);
        editor.on("selectionUpdate", updateBubble);
        editor.on("blur", onBlur);
        return () => {
            editor.off("selectionUpdate", updateBubble);
            editor.off("blur", onBlur);
        };
    }, [editor]);

    const lastAppliedInitialContentRef = React.useRef(initialContent);

    React.useEffect(() => {
        if (!editor) {
            return;
        }

        if (initialContent === lastAppliedInitialContentRef.current) {
            return;
        }

        const currentContent = editor.getHTML();
        const wasUntouchedSinceLastSync = currentContent === lastAppliedInitialContentRef.current;

        if (!wasUntouchedSinceLastSync) {
            return;
        }

        editor.commands.setContent(initialContent || "", { emitUpdate: false });
        lastAppliedInitialContentRef.current = initialContent;
    }, [editor, initialContent]);

    const getActiveHeadingLevel = (): HeadingLevel => {
        if (editor?.isActive("heading", { level: 1 })) return 1;
        if (editor?.isActive("heading", { level: 2 })) return 2;
        if (editor?.isActive("heading", { level: 3 })) return 3;
        return 0;
    };

    const hasAnyMainTools =
        enabledFeatures.heading ||
        enabledFeatures.formatting ||
        enabledFeatures.lists ||
        enabledFeatures.code ||
        enabledFeatures.quote ||
        enabledFeatures.link ||
        enabledFeatures.table ||
        enabledFeatures.image ||
        enabledFeatures.taskList ||
        enabledFeatures.alignment;

    if (!editor) {
        return <div className="rounded-lg border bg-gray-50 h-48 animate-pulse"></div>;
    }

    return (
        <div className='pd-text-editor w-full rounded-lg border border-gray-200 shadow-sm'>
            {/* Toolbar */}
            <div className={`flex flex-wrap items-center gap-1 border-b bg-gray-50 p-3 ${stickyToolbar ? "sticky top-0 z-10" : ""}`}>
                {/* Undo/Redo */}
                {enabledFeatures.history && <HistoryTools editor={editor} />}

                {enabledFeatures.history && hasAnyMainTools && <ToolbarDivider />}

                {/* Headings */}
                {enabledFeatures.heading && <HeadingSelect value={getActiveHeadingLevel()} onChange={(level) => {
                    if (level === 0) editor.chain().focus().setParagraph().run();
                    else editor.chain().focus().toggleHeading({ level }).run();
                }} />}

                {enabledFeatures.heading && (enabledFeatures.formatting || enabledFeatures.lists || enabledFeatures.code || enabledFeatures.quote || enabledFeatures.link || enabledFeatures.table || enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {enabledFeatures.formatting && <FormattingTools editor={editor} />}

                {enabledFeatures.formatting && (enabledFeatures.alignment || enabledFeatures.lists || enabledFeatures.code || enabledFeatures.quote || enabledFeatures.link || enabledFeatures.table || enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {enabledFeatures.alignment && <AlignmentTools editor={editor} />}

                {enabledFeatures.alignment && (enabledFeatures.lists || enabledFeatures.code || enabledFeatures.quote || enabledFeatures.link || enabledFeatures.table || enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {enabledFeatures.lists && <ListTools editor={editor} />}

                {enabledFeatures.lists && (enabledFeatures.code || enabledFeatures.quote || enabledFeatures.link || enabledFeatures.table || enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {enabledFeatures.code && <CodeTools editor={editor} />}

                {enabledFeatures.code && (enabledFeatures.quote || enabledFeatures.link || enabledFeatures.table || enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {enabledFeatures.quote && <QuoteTools editor={editor} />}

                {enabledFeatures.quote && (enabledFeatures.link || enabledFeatures.table || enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {/* Link */}
                {enabledFeatures.link && <LinkPopover editor={editor} />}

                {enabledFeatures.link && (enabledFeatures.table || enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {enabledFeatures.table && <TableTools editor={editor} />}

                {enabledFeatures.table && (enabledFeatures.image || enabledFeatures.taskList) && <ToolbarDivider />}

                {enabledFeatures.image && <ImagePopover editor={editor} onImageUpload={onImageUpload} />}

                {enabledFeatures.image && enabledFeatures.taskList && <ToolbarDivider />}

                {enabledFeatures.taskList && <InsertTools editor={editor} />}
            </div>

            {stickyToolbar === false && bubblePos && (
                <div className="fixed z-20 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-1 shadow-lg" style={{ top: bubblePos.top, left: bubblePos.left }}>
                    <FormattingTools editor={editor} />
                    {enabledFeatures.link && <LinkPopover editor={editor} />}
                </div>
            )}

            {enabledFeatures.slashCommand && slashOpen && (
                <div className="absolute left-4 top-16 z-20 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                    <button type="button" className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100" onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setSlashOpen(false); }}>Heading 1</button>
                    <button type="button" className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100" onClick={() => { editor.chain().focus().toggleBulletList().run(); setSlashOpen(false); }}>Bullet List</button>
                    <button type="button" className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100" onClick={() => { editor.chain().focus().toggleCodeBlock().run(); setSlashOpen(false); }}>Code Block</button>
                </div>
            )}

            {/* Editor */}
            <EditorContent
                editor={editor}
                className='w-full min-h-[300px] focus-within:bg-white'
            />
        </div>
    );
};

export default TextEditor;
