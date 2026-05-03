import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

export interface TextEditorFeatures {
    heading?: boolean;
    formatting?: boolean;
    lists?: boolean;
    code?: boolean;
    quote?: boolean;
    link?: boolean;
    history?: boolean;
    placeholder?: boolean;
    slashCommand?: boolean;
    table?: boolean;
    image?: boolean;
    taskList?: boolean;
    alignment?: boolean;
}

export type ToolbarPreset = "minimal" | "standard" | "full";

export const defaultTextEditorFeatures: Required<TextEditorFeatures> = {
    heading: true,
    formatting: true,
    lists: true,
    code: true,
    quote: true,
    link: true,
    history: true,
    placeholder: true,
    slashCommand: false,
    table: false,
    image: false,
    taskList: false,
    alignment: true,
};

export const toolbarPresetFeatures: Record<ToolbarPreset, Required<TextEditorFeatures>> = {
    minimal: {
        heading: false,
        formatting: true,
        lists: true,
        code: false,
        quote: false,
        link: true,
        history: true,
        placeholder: true,
        slashCommand: false,
        table: false,
        image: false,
        taskList: false,
        alignment: false,
    },
    standard: {
        ...defaultTextEditorFeatures,
    },
    full: {
        ...defaultTextEditorFeatures,
        slashCommand: true,
        table: true,
        image: true,
        taskList: true,
        alignment: true,
    },
};

export const withDefaultFeatures = (features?: TextEditorFeatures): Required<TextEditorFeatures> => ({
    ...defaultTextEditorFeatures,
    ...features,
});

export const createTextEditorExtensions = (features?: TextEditorFeatures) => {
    const f = withDefaultFeatures(features);

    return [
        StarterKit.configure({
            heading: false,
            bulletList: false,
            orderedList: false,
            listItem: false,
            codeBlock: false,
        }),
        ...(f.formatting ? [Bold, Italic, Underline, Strike] : []),
        ...(f.code
            ? [
                  Code,
                  CodeBlock.configure({
                      HTMLAttributes: {
                          class: "bg-gray-100 p-3 rounded text-sm font-mono",
                      },
                  }),
              ]
            : []),
        ...(f.heading ? [Heading.configure({ levels: [1, 2, 3] })] : []),
        ...(f.alignment ? [TextAlign.configure({ types: ["heading", "paragraph"] })] : []),
        ...(f.lists ? [BulletList, OrderedList, ListItem] : []),
        ...(f.link
            ? [
                  Link.configure({
                      openOnClick: false,
                      HTMLAttributes: {
                          class: "text-blue-600 underline",
                      },
                  }),
              ]
            : []),
        ...(f.taskList ? [TaskList, TaskItem.configure({ nested: true })] : []),
        ...(f.image ? [Image.configure({ inline: false, allowBase64: true })] : []),
        ...(f.table
            ? [
                  Table.configure({ resizable: true }),
                  TableRow,
                  TableHeader,
                  TableCell,
              ]
            : []),
    ];
};

export const editorContentClassName =
    "prose prose-sm max-w-none prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-h3:font-semibold mx-auto focus:outline-none min-h-[200px] p-4";
