import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TextEditor from './TextEditor';

const meta: Meta<typeof TextEditor> = {
    title: 'Components/Form/TextEditor',
    component: TextEditor,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A modular TipTap editor with feature flags, toolbar presets, sticky/floating toolbar modes, heading controls, formatting, lists, code, quote, link/image popovers, optional slash commands, and pluggable image upload callback.',
            },
        },
    },
    argTypes: {
        onUpdate: { action: 'content updated' },
        toolbarPreset: {
            control: 'select',
            options: ['minimal', 'standard', 'full'],
        },
        stickyToolbar: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextEditor>;

export const Default: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="max-w-3xl">
                <TextEditor onUpdate={setContent} />
                {content && (
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-gray-500">View HTML output</summary>
                        <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                            {content}
                        </pre>
                    </details>
                )}
            </div>
        );
    },
};

export const PresetMinimal: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="max-w-3xl">
                <TextEditor onUpdate={setContent} toolbarPreset="minimal" />
                <p className="mt-3 text-xs text-gray-500">Minimal preset: history + formatting + lists + link.</p>
            </div>
        );
    },
};

export const PresetFullWithSlash: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="max-w-3xl">
                <TextEditor onUpdate={setContent} toolbarPreset="full" features={{ slashCommand: true }} />
                <p className="mt-3 text-xs text-gray-500">Type / inside the editor to open slash commands.</p>
            </div>
        );
    },
};

export const FullPresetRichBlocks: Story = {
    render: () => {
        const [content, setContent] = useState('');
        const initialContent = `
            <h2>Full Preset Demo</h2>
            <p>Use toolbar tools to insert tables, images, and task lists.</p>
            <p>Select text to test bubble mode in the dedicated story.</p>
        `;

        return (
            <div className="max-w-4xl">
                <TextEditor
                    initialContent={initialContent}
                    onUpdate={setContent}
                    toolbarPreset="full"
                />
                <p className="mt-3 text-xs text-gray-500">Full preset includes table, image, task list, and slash command support.</p>
                {content && (
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-gray-500">View HTML output</summary>
                        <pre className="mt-2 max-h-72 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                            {content}
                        </pre>
                    </details>
                )}
            </div>
        );
    },
};

export const RemoteImageUploadFlow: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="max-w-4xl">
                <TextEditor
                    onUpdate={setContent}
                    toolbarPreset="full"
                    onImageUpload={async (file) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        return {
                            url: URL.createObjectURL(file),
                        };
                    }}
                />
                <p className="mt-3 text-xs text-gray-500">Demo uses mocked remote upload callback; replace with your backend API uploader.</p>
            </div>
        );
    },
};

export const BubbleToolbarMode: Story = {
    render: () => {
        const [content, setContent] = useState('');
        const initialContent = '<p>Select this text to open the floating bubble toolbar.</p>';
        return (
            <div className="max-w-3xl">
                <TextEditor
                    initialContent={initialContent}
                    onUpdate={setContent}
                    stickyToolbar={false}
                    toolbarPreset="standard"
                />
                <p className="mt-3 text-xs text-gray-500">Select text to reveal floating tools.</p>
            </div>
        );
    },
};

export const FeatureFlags: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="max-w-3xl">
                <TextEditor
                    onUpdate={setContent}
                    features={{
                        heading: true,
                        formatting: true,
                        lists: false,
                        code: true,
                        quote: false,
                        link: true,
                        history: true,
                        slashCommand: true,
                        table: true,
                        image: true,
                        taskList: true,
                    }}
                />
                <p className="mt-3 text-xs text-gray-500">Feature flags demo: lists/quote disabled, tables/images/tasks enabled.</p>
            </div>
        );
    },
};

export const TablesOnlyWorkflow: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="max-w-4xl">
                <TextEditor
                    onUpdate={setContent}
                    features={{
                        heading: false,
                        formatting: false,
                        lists: false,
                        code: false,
                        quote: false,
                        link: false,
                        history: true,
                        table: true,
                        image: false,
                        taskList: false,
                    }}
                />
                <p className="mt-3 text-xs text-gray-500">Focused table workflow: use the single table dropdown for all table actions.</p>
            </div>
        );
    },
};

export const TableWorkflow: Story = {
    render: () => {
        const [content, setContent] = useState('');
        const initialContent = '<p>Use the table tools to insert, grow, merge, split, and remove tables.</p>';

        return (
            <div className="max-w-5xl">
                <TextEditor
                    initialContent={initialContent}
                    onUpdate={setContent}
                    features={{
                        heading: false,
                        formatting: false,
                        alignment: false,
                        lists: false,
                        code: false,
                        quote: false,
                        link: false,
                        history: true,
                        table: true,
                        image: false,
                        taskList: false,
                    }}
                />
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-gray-500">
                    <li>Click the table button to open table actions.</li>
                    <li>Click Insert table.</li>
                    <li>Click inside a cell, then use add/delete row or column.</li>
                    <li>Select adjacent cells and use Merge/Split cells.</li>
                    <li>Use Delete table to remove it.</li>
                </ol>
            </div>
        );
    },
};

export const WithInitialContent: Story = {
    render: () => {
        const [content, setContent] = useState('');
        const initialContent = `
            <h1>Welcome to the Editor</h1>
            <p>This editor supports <strong>bold</strong>, <em>italic</em>, and <u>underline</u> formatting.</p>
            <ul>
                <li>Bullet list item 1</li>
                <li>Bullet list item 2</li>
            </ul>
            <blockquote>This is a blockquote.</blockquote>
        `;
        return (
            <div className="max-w-3xl">
                <label className="mb-2 block text-sm font-medium text-gray-700">Assignment Description</label>
                <TextEditor initialContent={initialContent} onUpdate={setContent} />
            </div>
        );
    },
};

export const InForm: Story = {
    render: () => {
        const [title, setTitle] = useState('');
        const [body, setBody] = useState('');
        return (
            <div className="max-w-3xl space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Notice Title</label>
                    <input
                        className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter notice title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Notice Content</label>
                    <TextEditor onUpdate={setBody} />
                </div>
                <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={() => alert(`Title: ${title}\nContent length: ${body.length} chars`)}
                >
                    Publish Notice
                </button>
            </div>
        );
    },
};
