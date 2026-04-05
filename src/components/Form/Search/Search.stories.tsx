import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Search from './Search';

const meta: Meta<typeof Search> = {
    title: 'Components/Form/Search',
    component: Search,
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        onSearch: { action: 'searched' },
    },
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
    args: {
        placeholder: 'Search...',
        onSearch: () => {},
    },
};

export const CustomPlaceholder: Story = {
    args: {
        placeholder: 'Search students by name or ID...',
        onSearch: () => {},
    },
};

export const WithResults: Story = {
    render: () => {
        const [query, setQuery] = useState('');
        const items = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams', 'Charlie Brown'];
        const filtered = query ? items.filter((i) => i.toLowerCase().includes(query.toLowerCase())) : items;

        return (
            <div className="max-w-sm space-y-3">
                <Search
                    placeholder="Search students..."
                    onSearch={setQuery}
                    className="w-full"
                />
                <ul className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
                    {filtered.length > 0 ? (
                        filtered.map((item) => (
                            <li key={item} className="px-4 py-2 text-sm text-gray-700">{item}</li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-sm text-gray-400">No results found</li>
                    )}
                </ul>
            </div>
        );
    },
};

export const InToolbar: Story = {
    render: () => (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-800">Student List</h3>
            <Search placeholder="Search..." onSearch={() => {}} className="w-64" />
        </div>
    ),
};
