import type { Meta, StoryObj } from '@storybook/react';
import { FileX, Users, ClipboardList } from 'lucide-react';
import EmptyStateCard from './EmptyStateCard';

const meta: Meta<typeof EmptyStateCard> = {
    title: 'Components/Cards/EmptyStateCard',
    component: EmptyStateCard,
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
        description: { control: 'text' },
        btnText: { control: 'text' },
        onClick: { action: 'button clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof EmptyStateCard>;

export const Playground: Story = {
    args: {
        title: 'No Record Found',
        description: 'There are no items to display at this time.',
    },
};

export const WithAction: Story = {
    args: {
        title: 'No Students Yet',
        description: 'Get started by adding your first student to the system.',
        btnText: 'Add Student',
        onClick: () => alert('Add Student clicked'),
        icon: <Users size={64} />,
    },
};

export const WithIcon: Story = {
    render: () => (
        <EmptyStateCard
            title="No Documents Found"
            description="Upload documents to see them here."
            btnText="Upload Document"
            onClick={() => alert('Upload clicked')}
            icon={<FileX size={64} />}
        />
    ),
};

export const NoDescription: Story = {
    args: {
        title: 'No Results',
        icon: <ClipboardList size={64} />,
    },
};

export const CustomStyling: Story = {
    args: {
        title: 'No Assignments',
        description: 'No assignments have been created for this term.',
        className: 'bg-blue-50 border border-blue-100',
    },
};
