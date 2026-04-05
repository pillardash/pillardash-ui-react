import type { Meta, StoryObj } from '@storybook/react';
import Loading from './Loading';

const meta: Meta<typeof Loading> = {
    title: 'Components/Loading',
    component: Loading,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['spinner', 'dots', 'pulse', 'bars', 'ripple'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg', 'xl'],
        },
        color: { control: 'text' },
        text: { control: 'text' },
        fullScreen: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Playground: Story = {
    args: {
        variant: 'spinner',
        size: 'md',
        color: 'blue-500',
    },
};

export const Variants: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {(['spinner', 'dots', 'pulse', 'bars', 'ripple'] as const).map((v) => (
                <div key={v} className="flex flex-col items-center gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-50">
                        <Loading variant={v} color="blue-500" />
                    </div>
                    <span className="text-xs capitalize text-gray-600">{v}</span>
                </div>
            ))}
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-end gap-8">
            {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                    <Loading variant="spinner" size={s} color="blue-500" />
                    <span className="text-xs uppercase text-gray-500">{s}</span>
                </div>
            ))}
        </div>
    ),
};

export const WithText: Story = {
    args: {
        variant: 'dots',
        size: 'md',
        color: 'blue-500',
        text: 'Loading data...',
    },
};

export const Colors: Story = {
    render: () => (
        <div className="flex flex-wrap gap-6">
            {[
                { label: 'Primary', color: 'blue-500' },
                { label: 'Success', color: 'green-500' },
                { label: 'Danger', color: 'red-500' },
                { label: 'Warning', color: 'amber-500' },
                { label: 'Purple', color: 'purple-500' },
                { label: 'Hex', color: '#F97316' },
            ].map(({ label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                    <Loading variant="spinner" color={color} />
                    <span className="text-xs text-gray-500">{label}</span>
                </div>
            ))}
        </div>
    ),
};

export const InlineUsage: Story = {
    render: () => (
        <div className="space-y-4 max-w-sm">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                <Loading variant="spinner" size="sm" color="white" />
                Saving...
            </button>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                <Loading variant="dots" size="sm" color="blue-500" />
                <span className="text-sm text-gray-600">Fetching records...</span>
            </div>
        </div>
    ),
};
