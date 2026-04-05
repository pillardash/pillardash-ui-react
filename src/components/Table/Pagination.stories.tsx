import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
    title: 'Components/Table/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        loading: { control: 'boolean' },
        onPageChange: { action: 'page changed' },
        onViewChange: { action: 'view changed' },
    },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
    render: () => {
        const [page, setPage] = useState(1);
        const [perPage, setPerPage] = useState(10);
        return (
            <Pagination
                currentPage={page}
                totalPages={10}
                totalItems={100}
                itemsPerPage={perPage}
                onPageChange={setPage}
                onViewChange={(v) => setPerPage(Number(v))}
            />
        );
    },
};

export const FewPages: Story = {
    render: () => {
        const [page, setPage] = useState(1);
        return (
            <Pagination
                currentPage={page}
                totalPages={3}
                totalItems={30}
                itemsPerPage={10}
                onPageChange={setPage}
            />
        );
    },
};

export const LastPage: Story = {
    render: () => {
        const [page, setPage] = useState(5);
        return (
            <Pagination
                currentPage={page}
                totalPages={5}
                totalItems={48}
                itemsPerPage={10}
                onPageChange={setPage}
            />
        );
    },
};

export const LoadingState: Story = {
    render: () => (
        <Pagination
            currentPage={3}
            totalPages={10}
            totalItems={100}
            itemsPerPage={10}
            loading
            onPageChange={() => {}}
        />
    ),
};
