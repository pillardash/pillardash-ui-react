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
                component: 'A rich text editor built with TipTap. Supports headings, bold/italic/underline, lists, code blocks, blockquotes, and links.',
            },
        },
    },
    argTypes: {
        onUpdate: { action: 'content updated' },
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
