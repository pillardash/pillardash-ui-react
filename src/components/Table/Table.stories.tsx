import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Table from './Table';
import type { Column } from './types';
import Badge from '../Badge/Badge';
import TableDropdown from './TableDropdown';
import { Edit, Trash2, Eye } from 'lucide-react';

type Student = {
    id: number;
    name: string;
    class: string;
    status: 'active' | 'inactive' | 'pending';
    score: number;
    email: string;
};

const students: Student[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams', 'Charlie Brown'][i % 5] + ` (${i + 1})`,
    class: ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2'][i % 5],
    status: (['active', 'inactive', 'pending'] as const)[i % 3],
    score: Math.floor(Math.random() * 50) + 50,
    email: `student${i + 1}@school.edu`,
}));

const statusVariant = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
} as const;

const columns: Column<Student>[] = [
    { title: 'ID', value: 'id', width: '80px', sortable: true },
    { title: 'Name', value: 'name', sortable: true },
    { title: 'Class', value: 'class' },
    {
        title: 'Status',
        value: (row) => (
            <Badge variant={statusVariant[row.status]} size="sm">{row.status}</Badge>
        ),
    },
    { title: 'Score', value: 'score', sortable: true, align: 'right' },
    {
        title: 'Actions',
        value: (row) => (
            <TableDropdown
                actions={[
                    { label: 'View', icon: <Eye size={14} />, onClick: () => alert(`View: ${row.name}`) },
                    { label: 'Edit', icon: <Edit size={14} />, onClick: () => alert(`Edit: ${row.name}`) },
                    { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => alert(`Delete: ${row.name}`), variant: 'danger' },
                ]}
            />
        ),
        align: 'right',
    },
];

const meta: Meta<typeof Table> = {
    title: 'Components/Table/Table',
    component: Table,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        loading: { control: 'boolean' },
        showPagination: { control: 'boolean' },
        useCardLayout: { control: 'boolean' },
        expandableRows: { control: 'boolean' },
        itemsPerPage: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof Table<Student>>;

export const Default: Story = {
    render: () => {
        const [page, setPage] = useState(1);
        const itemsPerPage = 10;
        const paginated = students.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return (
            <Table
                data={paginated}
                columns={columns}
                totalItems={students.length}
                currentPage={page}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
            />
        );
    },
};

export const Loading: Story = {
    render: () => (
        <Table
            data={[]}
            columns={columns}
            loading
            itemsPerPage={5}
            totalItems={0}
        />
    ),
};

export const Empty: Story = {
    render: () => (
        <Table
            data={[]}
            columns={columns}
            totalItems={0}
            showPagination={false}
        />
    ),
};

export const WithExpandableRows: Story = {
    render: () => {
        const [page, setPage] = useState(1);
        const paginated = students.slice(0, 8);
        return (
            <Table
                data={paginated}
                columns={columns.slice(0, 4)}
                totalItems={paginated.length}
                currentPage={page}
                itemsPerPage={10}
                onPageChange={setPage}
                expandableRows
                expandedRowRender={(row) => (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium text-gray-500">Email:</span> {row.email}</div>
                        <div><span className="font-medium text-gray-500">Score:</span> {row.score}</div>
                    </div>
                )}
                getRowKey={(item) => item.id}
            />
        );
    },
};

export const CardLayout: Story = {
    render: () => (
        <Table
            data={students.slice(0, 6)}
            columns={columns.slice(0, 4)}
            totalItems={6}
            useCardLayout
            showPagination={false}
        />
    ),
};
