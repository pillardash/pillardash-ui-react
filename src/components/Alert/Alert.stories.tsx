import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Alert from './Alert';

const meta: Meta<typeof Alert> = {
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A toast-style alert that auto-dismisses with a progress bar. Renders fixed top-right.',
            },
        },
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['success', 'error', 'info', 'warning'],
        },
        duration: {
            control: 'number',
            description: 'Duration in ms before auto-dismiss',
        },
        message: { control: 'text' },
        description: { control: 'text' },
        onClose: { action: 'closed' },
    },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Playground: Story = {
    args: {
        message: 'This is an alert message',
        type: 'info',
        duration: 9000,
    },
};

export const Variants: Story = {
    render: () => {
        const [visible, setVisible] = useState<string[]>(['success', 'error', 'info', 'warning']);
        return (
            <div className="space-y-4">
                <p className="text-sm text-gray-500">Click buttons to show alerts (fixed top-right)</p>
                <div className="flex flex-wrap gap-3">
                    {(['success', 'error', 'info', 'warning'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setVisible((v) => [...v, type])}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium capitalize hover:bg-gray-200"
                        >
                            Show {type}
                        </button>
                    ))}
                </div>
                {visible.map((type, i) => (
                    <Alert
                        key={`${type}-${i}`}
                        message={`${type.charAt(0).toUpperCase() + type.slice(1)} alert`}
                        description={`This is a ${type} message with description.`}
                        type={type as any}
                        duration={5000}
                        onClose={() => setVisible((v) => v.filter((_, idx) => idx !== i))}
                    />
                ))}
            </div>
        );
    },
};

export const WithDescription: Story = {
    args: {
        message: 'Upload complete',
        description: 'Your file has been successfully uploaded to the server.',
        type: 'success',
        duration: 9000,
    },
};

export const LongDuration: Story = {
    args: {
        message: 'Processing your request',
        description: 'This alert will stay visible longer.',
        type: 'warning',
        duration: 15000,
    },
};
