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
  showCounts?: boolean;
  status?: React.ReactNode;
  className?: string;
  editorClassName?: string;
  contentClassName?: string;
}

const getTextEditorCounts = (text: string) => {
  const trimmedText = text.trim();

  return {
    words: trimmedText ? trimmedText.split(/\s+/).length : 0,
    characters: text.length,
  };
};

const getEditorContentByFormat = (
  editor: Editor,
  contentFormat: TextEditorContentFormat,
) => {
  return contentFormat === "markdown" ? editor.getMarkdown() : editor.getHTML();
};

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = "",
  onUpdate,
  contentFormat = "html",
  features,
  stickyToolbar = true,
  toolbarPreset = "standard",
  onImageUpload,
  placeholder = "Start writing...",
  showCounts = true,
  status,
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
  const [counts, setCounts] = React.useState({ words: 0, characters: 0 });
  const onUpdateRef = React.useRef(onUpdate);
  const contentFormatRef = React.useRef(contentFormat);
  onUpdateRef.current = onUpdate;
  contentFormatRef.current = contentFormat;

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
      return getEditorContentByFormat(editorInstance, contentFormat);
    },
    [contentFormat],
  );

  const editor = useEditor(
    {
      extensions: editorExtensions,
      content: initialContent,
      contentType: contentFormat === "markdown" ? "markdown" : undefined,
      onUpdate: ({ editor }) => {
        onUpdateRef.current(
          getEditorContentByFormat(editor, contentFormatRef.current),
        );
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
    [
      contentClassName,
      contentFormat,
      editorExtensions,
      enabledFeatures.slashCommand,
    ],
  );

  React.useEffect(() => {
    if (!editor) return;
    const updateCounts = () => {
      setCounts(getTextEditorCounts(editor.getText()));
    };

    updateCounts();
    editor.on("update", updateCounts);

    return () => {
      editor.off("update", updateCounts);
    };
  }, [editor]);

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

    setCounts(getTextEditorCounts(editor.getText()));
  }, [contentFormat, editor, getEditorContent, initialContent]);

  const getActiveHeadingLevel = (): HeadingLevel => {
    if (editor?.isActive("heading", { level: 1 })) return 1;
    if (editor?.isActive("heading", { level: 2 })) return 2;
    if (editor?.isActive("heading", { level: 3 })) return 3;
    return 0;
  };

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
      <div className="h-48 animate-pulse rounded-xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800"></div>
    );
  }

  const toolbarGroups = [
    {
      key: "history",
      enabled: enabledFeatures.history,
      render: () => <HistoryTools editor={editor} />,
    },
    {
      key: "heading",
      enabled: enabledFeatures.heading,
      render: () => (
        <HeadingSelect
          value={getActiveHeadingLevel()}
          onChange={(level) => {
            if (level === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level }).run();
          }}
        />
      ),
    },
    {
      key: "formatting",
      enabled: enabledFeatures.formatting,
      render: () => <FormattingTools editor={editor} />,
    },
    {
      key: "alignment",
      enabled: enabledFeatures.alignment,
      render: () => <AlignmentTools editor={editor} />,
    },
    {
      key: "lists",
      enabled: enabledFeatures.lists,
      render: () => <ListTools editor={editor} />,
    },
    {
      key: "code",
      enabled: enabledFeatures.code,
      render: () => <CodeTools editor={editor} />,
    },
    {
      key: "quote",
      enabled: enabledFeatures.quote,
      render: () => <QuoteTools editor={editor} />,
    },
    {
      key: "link",
      enabled: enabledFeatures.link,
      render: () => <LinkPopover editor={editor} />,
    },
    {
      key: "table",
      enabled: enabledFeatures.table,
      render: () => <TableTools editor={editor} />,
    },
    {
      key: "image",
      enabled: enabledFeatures.image,
      render: () => <ImagePopover editor={editor} onImageUpload={onImageUpload} />,
    },
    {
      key: "taskList",
      enabled: enabledFeatures.taskList,
      render: () => <InsertTools editor={editor} />,
    },
  ].filter((group) => group.enabled);

  return (
    <div
      className={`pd-text-editor relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm ring-1 ring-black/[0.02] dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:ring-white/[0.04] ${className}`.trim()}
    >
      {stickyToolbar && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white/95 px-3 py-2 text-gray-700 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 dark:text-gray-200">
          {toolbarGroups.map((group, index) => (
            <React.Fragment key={group.key}>
              {index > 0 && <ToolbarDivider />}
              {group.render()}
            </React.Fragment>
          ))}
        </div>
      )}

      {stickyToolbar === false && bubblePos && (
        <div
          className="fixed z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-gray-200 bg-white/95 p-1 text-gray-700 shadow-xl shadow-gray-900/10 ring-1 ring-black/5 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-200 dark:shadow-black/30 dark:ring-white/10"
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
        className={`min-h-[300px] w-full focus-within:bg-white dark:focus-within:bg-gray-950 ${editorClassName}`.trim()}
      />

      {(showCounts || status) && (
        <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/70 px-4 py-2 text-[11px] font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
          {showCounts ? (
            <div className="flex items-center gap-3 font-mono">
              <span>{counts.words} words</span>
              <span>{counts.characters} chars</span>
            </div>
          ) : (
            <span />
          )}

          {status && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span>{status}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextEditor;
