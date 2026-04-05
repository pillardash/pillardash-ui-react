import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
    title: 'Components/ConfirmDialog',
    component: ConfirmDialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['success', 'error', 'info', 'warning'],
        },
        isOpen: { control: 'boolean' },
        onConfirm: { action: 'confirmed' },
        onCancel: { action: 'cancelled' },
    },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

const InteractiveDialog = (args: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="p-8">
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
                Open Dialog
            </button>
            <ConfirmDialog
                {...args}
                isOpen={isOpen}
                onConfirm={() => { setIsOpen(false); args.onConfirm?.(); }}
                onCancel={() => { setIsOpen(false); args.onCancel?.(); }}
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <InteractiveDialog {...args} />,
    args: {
        message: 'Are you sure you want to perform this action?',
        title: 'Confirm Action',
        type: 'warning',
    },
};

export const Danger: Story = {
    render: (args) => <InteractiveDialog {...args} />,
    args: {
        message: 'This will permanently delete the record.',
        title: 'Delete Record',
        type: 'error',
        confirmText: 'Delete',
    },
};

export const Success: Story = {
    render: (args) => <InteractiveDialog {...args} />,
    args: {
        message: 'Your changes have been reviewed and are ready to be published.',
        title: 'Publish Changes',
        type: 'success',
        confirmText: 'Publish',
    },
};

export const WithDescription: Story = {
    render: (args) => <InteractiveDialog {...args} />,
    args: {
        message: 'Are you sure you want to archive this student?',
        description: 'Archived students will no longer appear in active lists but their records will be preserved.',
        title: 'Archive Student',
        type: 'info',
        confirmText: 'Archive',
    },
};
