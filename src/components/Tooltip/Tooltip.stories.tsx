import type { Meta, StoryObj } from '@storybook/react';
import { Info, HelpCircle, AlertTriangle } from 'lucide-react';
import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        position: {
            control: 'select',
            options: ['top', 'bottom', 'left', 'right'],
        },
        variant: {
            control: 'radio',
            options: ['dark', 'light', 'accent'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        delay: { control: 'number' },
        disabled: { control: 'boolean' },
        content: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
    args: {
        content: 'This is a tooltip',
        position: 'top',
        variant: 'dark',
        size: 'md',
    },
    render: (args) => (
        <Tooltip {...args}>
            <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                Hover me
            </button>
        </Tooltip>
    ),
};

export const Positions: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-8 p-12">
            {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
                <div key={pos} className="flex justify-center">
                    <Tooltip content={`${pos} tooltip`} position={pos}>
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm capitalize hover:bg-gray-50">
                            {pos}
                        </button>
                    </Tooltip>
                </div>
            ))}
        </div>
    ),
};

export const Variants: Story = {
    render: () => (
        <div className="flex gap-6">
            {(['dark', 'light', 'accent'] as const).map((v) => (
                <Tooltip key={v} content={`${v} tooltip`} variant={v}>
                    <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm capitalize hover:bg-gray-50">
                        {v}
                    </button>
                </Tooltip>
            ))}
        </div>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <div className="flex items-center gap-6">
            <Tooltip content="Additional information about this field" position="top">
                <Info size={20} className="text-blue-500 cursor-help" />
            </Tooltip>
            <Tooltip content="This action requires admin permission" variant="accent">
                <HelpCircle size={20} className="text-gray-400 cursor-help" />
            </Tooltip>
            <Tooltip content="Warning: This action cannot be undone" variant="dark">
                <AlertTriangle size={20} className="text-amber-500 cursor-help" />
            </Tooltip>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-6">
            {(['sm', 'md', 'lg'] as const).map((s) => (
                <Tooltip key={s} content={`Size ${s} tooltip`} size={s}>
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                        {s}
                    </button>
                </Tooltip>
            ))}
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Tooltip content="This tooltip is disabled" disabled>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
                No tooltip
            </button>
        </Tooltip>
    ),
};

export const InFormLabel: Story = {
    render: () => (
        <div className="max-w-sm">
            <div className="flex items-center gap-1 mb-1">
                <label className="text-sm font-medium text-gray-700">Student ID</label>
                <Tooltip content="The unique identifier assigned to each student at enrollment" size="sm">
                    <Info size={14} className="text-gray-400 cursor-help" />
                </Tooltip>
            </div>
            <input
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm"
                placeholder="e.g. STU-2024-001"
            />
        </div>
    ),
};
