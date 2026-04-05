import type { Meta, StoryObj } from '@storybook/react';
import ExportButton from './ExportButton';

const meta: Meta<typeof ExportButton> = {
    title: 'Components/ExportButton',
    component: ExportButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A split button for exporting data in PDF, CSV, or Excel formats.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ExportButton>;

export const Default: Story = {};

export const InContext: Story = {
    render: () => (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-800">Student Records</h3>
            <ExportButton />
        </div>
    ),
};
