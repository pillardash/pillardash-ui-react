import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    argTypes: {
        showBackButton: { control: 'boolean' },
        separator: { control: 'text' },
        onBackClick: { action: 'back clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Playground: Story = {
    args: {
        items: [
            { label: 'Dashboard' },
            { label: 'Students' },
            { label: 'John Doe', isActive: true },
        ],
        showBackButton: true,
    },
};

export const WithNavigation: Story = {
    render: () => (
        <Breadcrumb
            items={[
                { label: 'Home', onClick: () => alert('Go to Home') },
                { label: 'Settings', onClick: () => alert('Go to Settings') },
                { label: 'Profile', isActive: true },
            ]}
            onBackClick={() => alert('Back clicked')}
        />
    ),
};

export const NoBackButton: Story = {
    args: {
        items: [
            { label: 'Dashboard' },
            { label: 'Reports' },
            { label: 'Term 1', isActive: true },
        ],
        showBackButton: false,
    },
};

export const CustomSeparator: Story = {
    args: {
        items: [
            { label: 'Home' },
            { label: 'Classes' },
            { label: 'JSS 1', isActive: true },
        ],
        separator: ' > ',
        showBackButton: false,
    },
};

export const DeepNavigation: Story = {
    args: {
        items: [
            { label: 'Dashboard' },
            { label: 'Academic' },
            { label: 'Assessments' },
            { label: 'Results' },
            { label: 'Term 2 Result', isActive: true },
        ],
        showBackButton: true,
    },
};
