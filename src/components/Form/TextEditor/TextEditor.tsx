import React from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import ImagePopover from "./ImagePopover";
import LinkPopover from "./LinkPopover";
import {
  AlignmentTools,
  CodeTools,
  FormattingTools,
  HistoryTools,
  InsertTools,
  ListTools,
  QuoteTools,
  TableTools,
} from "./ToolbarGroups";
import {
  createTextEditorExtensions,
  editorContentClassName,
  type TextEditorContentFormat,
  type TextEditorFeatures,
  type ToolbarPreset,
  toolbarPresetFeatures,
  withDefaultFeatures,
} from "./extensions";
import { HeadingLevel, HeadingSelect, ToolbarDivider } from "./toolbar";

export interface TextEditorProps {
  initialContent?: string;
  onUpdate: (content: string) => void;
  contentFormat?: TextEditorContentFormat;
  features?: TextEditorFeatures;
  stickyToolbar?: boolean;
  toolbarPreset?: ToolbarPreset;
  onImageUpload?: (file: File) => Promise<{ url: string; assetId?: string }>;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  contentClassName?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = "",
  onUpdate,
  contentFormat = "html",
  features,
  stickyToolbar = true,
  toolbarPreset = "standard",
  onImageUpload,
  placeholder = "Start writing...",
  className = "",
  editorClassName = "",
  contentClassName = "",
}) => {
  const enabledFeatures = React.useMemo(
    () =>
      withDefaultFeatures({
        ...toolbarPresetFeatures[toolbarPreset],
        ...features,
      }),
    [features, toolbarPreset],
  );
  const [slashOpen, setSlashOpen] = React.useState(false);
  const [bubblePos, setBubblePos] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  const editorExtensions = React.useMemo(
    () =>
      createTextEditorExtensions(enabledFeatures, {
        contentFormat,
        placeholder,
      }),
    [contentFormat, enabledFeatures, placeholder],
  );

  const getEditorContent = React.useCallback(
    (editorInstance: Editor) => {
      return contentFormat === "markdown"
        ? editorInstance.getMarkdown()
        : editorInstance.getHTML();
    },
    [contentFormat],
  );

  const editor = useEditor(
    {
      extensions: editorExtensions,
      content: initialContent,
      contentType: contentFormat === "markdown" ? "markdown" : undefined,
      onUpdate: ({ editor }) => {
        onUpdate(getEditorContent(editor));
      },
      editorProps: {
        attributes: {
          class: `${editorContentClassName} ${contentClassName}`.trim(),
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
    },
    [editorExtensions, contentFormat],
  );

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
      setBubblePos({
        top: rect.top + window.scrollY - 48,
        left: rect.left + window.scrollX + rect.width / 2,
      });
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
  const lastAppliedEditorContentRef = React.useRef<string | null>(null);
  const lastEditorRef = React.useRef<Editor | null>(null);

  React.useEffect(() => {
    if (!editor) {
      return;
    }

    if (lastEditorRef.current !== editor) {
      lastEditorRef.current = editor;
      lastAppliedInitialContentRef.current = initialContent;
      lastAppliedEditorContentRef.current = getEditorContent(editor);
      return;
    }

    if (lastAppliedEditorContentRef.current === null) {
      lastAppliedEditorContentRef.current = getEditorContent(editor);
    }

    if (initialContent === lastAppliedInitialContentRef.current) {
      return;
    }

    const currentContent = getEditorContent(editor);
    const wasUntouchedSinceLastSync =
      currentContent === lastAppliedEditorContentRef.current;

    if (!wasUntouchedSinceLastSync) {
      return;
    }

    editor.commands.setContent(initialContent || "", {
      emitUpdate: false,
      contentType: contentFormat === "markdown" ? "markdown" : undefined,
    });
    lastAppliedInitialContentRef.current = initialContent;
    lastAppliedEditorContentRef.current = getEditorContent(editor);
  }, [contentFormat, editor, getEditorContent, initialContent]);

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

  const slashCommands = [
    {
      label: "Heading 1",
      enabled: enabledFeatures.heading,
      run: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Bullet List",
      enabled: enabledFeatures.lists,
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Code Block",
      enabled: enabledFeatures.code,
      run: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
  ].filter((item) => item.enabled);

  if (!editor) {
    return (
      <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"></div>
    );
  }

  return (
    <div
      className={`pd-text-editor relative w-full rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 ${className}`.trim()}
    >
      {stickyToolbar && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-3 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
          {enabledFeatures.history && <HistoryTools editor={editor} />}

          {enabledFeatures.history && hasAnyMainTools && <ToolbarDivider />}

          {enabledFeatures.heading && (
            <HeadingSelect
              value={getActiveHeadingLevel()}
              onChange={(level) => {
                if (level === 0) editor.chain().focus().setParagraph().run();
                else editor.chain().focus().toggleHeading({ level }).run();
              }}
            />
          )}

          {enabledFeatures.heading &&
            (enabledFeatures.formatting ||
              enabledFeatures.lists ||
              enabledFeatures.code ||
              enabledFeatures.quote ||
              enabledFeatures.link ||
              enabledFeatures.table ||
              enabledFeatures.image ||
              enabledFeatures.taskList) && <ToolbarDivider />}

          {enabledFeatures.formatting && <FormattingTools editor={editor} />}

          {enabledFeatures.formatting &&
            (enabledFeatures.alignment ||
              enabledFeatures.lists ||
              enabledFeatures.code ||
              enabledFeatures.quote ||
              enabledFeatures.link ||
              enabledFeatures.table ||
              enabledFeatures.image ||
              enabledFeatures.taskList) && <ToolbarDivider />}

          {enabledFeatures.alignment && <AlignmentTools editor={editor} />}

          {enabledFeatures.alignment &&
            (enabledFeatures.lists ||
              enabledFeatures.code ||
              enabledFeatures.quote ||
              enabledFeatures.link ||
              enabledFeatures.table ||
              enabledFeatures.image ||
              enabledFeatures.taskList) && <ToolbarDivider />}

          {enabledFeatures.lists && <ListTools editor={editor} />}

          {enabledFeatures.lists &&
            (enabledFeatures.code ||
              enabledFeatures.quote ||
              enabledFeatures.link ||
              enabledFeatures.table ||
              enabledFeatures.image ||
              enabledFeatures.taskList) && <ToolbarDivider />}

          {enabledFeatures.code && <CodeTools editor={editor} />}

          {enabledFeatures.code &&
            (enabledFeatures.quote ||
              enabledFeatures.link ||
              enabledFeatures.table ||
              enabledFeatures.image ||
              enabledFeatures.taskList) && <ToolbarDivider />}

          {enabledFeatures.quote && <QuoteTools editor={editor} />}

          {enabledFeatures.quote &&
            (enabledFeatures.link ||
              enabledFeatures.table ||
              enabledFeatures.image ||
              enabledFeatures.taskList) && <ToolbarDivider />}

          {enabledFeatures.link && <LinkPopover editor={editor} />}

          {enabledFeatures.link &&
            (enabledFeatures.table ||
              enabledFeatures.image ||
              enabledFeatures.taskList) && <ToolbarDivider />}

          {enabledFeatures.table && <TableTools editor={editor} />}

          {enabledFeatures.table &&
            (enabledFeatures.image || enabledFeatures.taskList) && (
              <ToolbarDivider />
            )}

          {enabledFeatures.image && (
            <ImagePopover editor={editor} onImageUpload={onImageUpload} />
          )}

          {enabledFeatures.image && enabledFeatures.taskList && (
            <ToolbarDivider />
          )}

          {enabledFeatures.taskList && <InsertTools editor={editor} />}
        </div>
      )}

      {stickyToolbar === false && bubblePos && (
        <div
          className="fixed z-20 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-1 text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          style={{ top: bubblePos.top, left: bubblePos.left }}
        >
          <FormattingTools editor={editor} />
          {enabledFeatures.link && <LinkPopover editor={editor} />}
        </div>
      )}

      {enabledFeatures.slashCommand && slashOpen && slashCommands.length > 0 && (
        <div className="absolute left-4 top-16 z-20 w-56 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
          {slashCommands.map((item) => (
            <button
              key={item.label}
              type="button"
              className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                item.run();
                setSlashOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={`min-h-[300px] w-full focus-within:bg-white dark:focus-within:bg-gray-900 ${editorClassName}`.trim()}
      />
    </div>
  );
};

export default TextEditor;
