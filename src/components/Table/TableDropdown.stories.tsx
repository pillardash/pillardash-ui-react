import type { Meta, StoryObj } from '@storybook/react';
import { Edit, Trash2, Eye, Download, Archive } from 'lucide-react';
import TableDropdown from './TableDropdown';

const meta: Meta<typeof TableDropdown> = {
    title: 'Components/Table/TableDropdown',
    component: TableDropdown,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof TableDropdown>;

export const Default: Story = {
    args: {
        actions: [
            { label: 'View', icon: <Eye size={14} />, onClick: () => alert('View') },
            { label: 'Edit', icon: <Edit size={14} />, onClick: () => alert('Edit') },
            { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => alert('Delete'), variant: 'danger' },
        ],
    },
};

export const WithDisabledAction: Story = {
    args: {
        actions: [
            { label: 'View', icon: <Eye size={14} />, onClick: () => alert('View') },
            { label: 'Download', icon: <Download size={14} />, onClick: () => alert('Download'), disabled: true },
            { label: 'Archive', icon: <Archive size={14} />, onClick: () => alert('Archive') },
            { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => alert('Delete'), variant: 'danger' },
        ],
    },
};

export const InTableContext: Story = {
    render: () => (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">Class</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {['John Doe', 'Jane Smith', 'Alice Johnson'].map((name) => (
                        <tr key={name} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">JSS 1</td>
                            <td className="px-6 py-4 text-right">
                                <TableDropdown
                                    actions={[
                                        { label: 'View Profile', icon: <Eye size={14} />, onClick: () => alert(`View: ${name}`) },
                                        { label: 'Edit', icon: <Edit size={14} />, onClick: () => alert(`Edit: ${name}`) },
                                        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => alert(`Delete: ${name}`), variant: 'danger' },
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
};

export const CustomTrigger: Story = {
    render: () => (
        <TableDropdown
            trigger={
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Actions
                </button>
            }
            actions={[
                { label: 'Export PDF', onClick: () => alert('Export PDF') },
                { label: 'Export CSV', onClick: () => alert('Export CSV') },
                { label: 'Print', onClick: () => alert('Print') },
            ]}
        />
    ),
};
