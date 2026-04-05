import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ConfirmationAlert from './ConfirmationAlert';

const meta: Meta<typeof ConfirmationAlert> = {
    title: 'Components/ConfirmationAlert',
    component: ConfirmationAlert,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A modal-style confirmation popup with multiple types, loading states, and accessibility support.',
            },
        },
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['default', 'danger', 'warning', 'success', 'info'],
        },
        maxWidth: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        isOpen: { control: 'boolean' },
        isLoading: { control: 'boolean' },
        showIcon: { control: 'boolean' },
        showCloseButton: { control: 'boolean' },
        closeOnOverlayClick: { control: 'boolean' },
        onConfirm: { action: 'confirmed' },
        onCancel: { action: 'cancelled' },
    },
};

export default meta;
type Story = StoryObj<typeof ConfirmationAlert>;

const InteractiveConfirmation = (args: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsOpen(false);
        args.onConfirm?.();
    };

    return (
        <div className="p-8">
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
                Open Confirmation
            </button>
            <ConfirmationAlert
                {...args}
                isOpen={isOpen}
                isLoading={isLoading}
                onConfirm={handleConfirm}
                onCancel={() => { setIsOpen(false); args.onCancel?.(); }}
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <InteractiveConfirmation {...args} />,
    args: {
        title: 'Confirm Action',
        message: 'Are you sure you want to continue with this action?',
        type: 'default',
    },
};

export const Danger: Story = {
    render: (args) => <InteractiveConfirmation {...args} />,
    args: {
        title: 'Delete Item',
        message: 'This action cannot be undone. Are you sure you want to permanently delete this item?',
        confirmText: 'Delete',
        type: 'danger',
    },
};

export const Warning: Story = {
    render: (args) => <InteractiveConfirmation {...args} />,
    args: {
        title: 'Warning',
        message: 'This action may have unintended consequences. Do you want to proceed?',
        confirmText: 'Proceed',
        type: 'warning',
    },
};

export const Success: Story = {
    render: (args) => <InteractiveConfirmation {...args} />,
    args: {
        title: 'Save Changes',
        message: 'Everything looks good! Would you like to save these changes?',
        confirmText: 'Save',
        type: 'success',
    },
};

export const AllTypes: Story = {
    render: () => {
        const [openType, setOpenType] = useState<string | null>(null);
        const types = ['default', 'danger', 'warning', 'success', 'info'] as const;

        return (
            <div className="space-y-4 p-8">
                <div className="flex flex-wrap gap-3">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setOpenType(type)}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium capitalize hover:bg-gray-200"
                        >
                            {type}
                        </button>
                    ))}
                </div>
                {types.map((type) => (
                    <ConfirmationAlert
                        key={type}
                        isOpen={openType === type}
                        title={`${type.charAt(0).toUpperCase() + type.slice(1)} Confirmation`}
                        message={`This is a ${type} confirmation dialog.`}
                        type={type}
                        onConfirm={() => setOpenType(null)}
                        onCancel={() => setOpenType(null)}
                    />
                ))}
            </div>
        );
    },
};
