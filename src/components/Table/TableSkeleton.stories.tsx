import type { Meta, StoryObj } from '@storybook/react';
import { TableSkeleton } from './TableSkeleton';

const meta: Meta<typeof TableSkeleton> = {
    title: 'Components/Table/TableSkeleton',
    component: TableSkeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        columns: { control: 'number' },
        rows: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof TableSkeleton>;

export const Default: Story = {
    render: (args) => (
        <table className="w-full">
            <thead>
                <tr className="bg-gray-100">
                    {Array.from({ length: args.columns || 5 }, (_, i) => (
                        <th key={i} className="px-6 py-3 text-left text-sm font-semibold text-gray-500">
                            Column {i + 1}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <TableSkeleton {...args} />
            </tbody>
        </table>
    ),
    args: {
        columns: 5,
        rows: 5,
    },
};

export const FewColumns: Story = {
    render: () => (
        <table className="w-full">
            <thead>
                <tr className="bg-gray-100">
                    {['Name', 'Class', 'Status'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-500">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <TableSkeleton columns={3} rows={8} />
            </tbody>
        </table>
    ),
};
