import React from "react";

import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold as BoldIcon,
    Italic as ItalicIcon,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Code as CodeIcon,
    FileCode,
    Link as LinkIcon,
    Strikethrough,
    Quote,
    Minus,
    Undo2,
    Redo2, SeparatorVertical
} from "lucide-react";

export interface TextEditorProps {
    initialContent?: string;
    onUpdate: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialContent = "", onUpdate }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
            }),
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Underline,
            Strike,
            Code,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 p-3 rounded text-sm font-mono',
                },
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            BulletList,
            OrderedList,
            ListItem,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
            },
        },
        immediatelyRender: false,
    });

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    const removeLink = () => {
        editor?.chain().focus().unsetLink().run();
    };

    if (!editor) {
        return <div className="rounded-lg border bg-gray-50 h-48 animate-pulse"></div>;
    }

    return (
        <div className='rounded-lg border border-gray-200 shadow-sm'>
            {/* Toolbar */}
            <div className='flex flex-wrap items-center gap-1 border-b bg-gray-50 p-3'>
                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${!editor.can().undo() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type='button'
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo2 size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${!editor.can().redo() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type='button'
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo2 size={16} />
                </button>

                <div className="mx-2 h-6 w-px bg-gray-300"></div>

                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("heading", { level: 1 })
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Heading 1"
                >
                    <Heading1 size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("heading", { level: 2 })
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Heading 2"
                >
                    <Heading2 size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("heading", { level: 3 })
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Heading 3"
                >
                    <Heading3 size={16} />
                </button>

                <SeparatorVertical className="mx-2 h-6 w-px bg-gray-300" />

                {/* Text Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("bold")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Bold"
                >
                    <BoldIcon size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("italic")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Italic"
                >
                    <ItalicIcon size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("underline")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Underline"
                >
                    <UnderlineIcon size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("strike")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Strikethrough"
                >
                    <Strikethrough size={16} />
                </button>

                <SeparatorVertical className="mx-2 h-6 w-px bg-gray-300" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("bulletList")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("orderedList")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </button>

                <SeparatorVertical className="mx-2 h-6 w-px bg-gray-300" />

                {/* Code */}
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("code")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Inline Code"
                >
                    <CodeIcon size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("codeBlock")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Code Block"
                >
                    <FileCode size={16} />
                </button>

                <SeparatorVertical className="mx-2 h-6 w-px bg-gray-300" />

                {/* Quote */}
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded transition-colors ${
                        editor.isActive("blockquote")
                            ? "bg-blue-200 text-blue-800"
                            : "hover:bg-gray-200"
                    }`}
                    type='button'
                    title="Quote"
                >
                    <Quote size={16} />
                </button>

                <SeparatorVertical className="mx-2 h-6 w-px bg-gray-300" />

                {/* Link */}
                {editor.isActive('link') ? (
                    <button
                        onClick={removeLink}
                        className="p-2 rounded bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors"
                        type='button'
                        title="Remove Link"
                    >
                        <LinkIcon size={16} />
                    </button>
                ) : (
                    <button
                        onClick={addLink}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        type='button'
                        title="Add Link"
                    >
                        <LinkIcon size={16} />
                    </button>
                )}
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className='min-h-[300px] focus-within:bg-white'
            />
        </div>
    );
};

export default TextEditor;