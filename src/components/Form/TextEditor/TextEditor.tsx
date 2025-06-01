import React from "react";

import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon } from "lucide-react";

import DiscListIcon from "../../Icons/DiscListIcon";
import NumberListIcon from "../../Icons/NumberListIcon";

export interface TextEditorProps {
    initialContent?: string;
    onUpdate: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialContent = "", onUpdate }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Underline,
            BulletList,
            OrderedList,
            ListItem,
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
    });

    return (
        <div className='rounded-lg border'>
            <div className='flex gap-4 border-b bg-gray-50 p-2'>
                <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`mx-1 p-1 ${editor?.isActive("bold") ? "rounded bg-gray-200" : ""}`}
                    type='button'
                >
                    <BoldIcon size={18} />
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`mx-1 p-1 ${editor?.isActive("italic") ? "rounded bg-gray-200" : ""}`}
                    type='button'
                >
                    <ItalicIcon size={18} />
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`mx-1 p-1 ${editor?.isActive("underline") ? "rounded bg-gray-200" : ""}`}
                    type='button'
                >
                    <UnderlineIcon size={18} />
                </button>
                <span className='mx-2 h-6 border-r'></span>
                <button
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`mx-1 p-1 ${editor?.isActive("bulletList") ? "rounded bg-gray-200" : ""}`}
                    type='button'
                >
                    <DiscListIcon />
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`mx-1 p-1 ${editor?.isActive("orderedList") ? "rounded bg-gray-200" : ""}`}
                    type='button'
                >
                    <NumberListIcon />
                </button>
            </div>
            <EditorContent editor={editor} className='min-h-32 p-4' />
        </div>
    );
};

export default TextEditor;
