import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'success', 'warning', 'error', 'info'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
    args: {
        children: 'Badge',
        variant: 'default',
        size: 'md',
    },
};

export const Variants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-3">
            {(['default', 'secondary', 'success', 'warning', 'error', 'info'] as const).map((v) => (
                <Badge key={v} variant={v}>{v}</Badge>
            ))}
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            {(['sm', 'md', 'lg'] as const).map((s) => (
                <Badge key={s} size={s}>Size {s}</Badge>
            ))}
        </div>
    ),
};

export const Clickable: Story = {
    render: () => (
        <div className="flex flex-wrap gap-3">
            {(['default', 'secondary', 'success', 'warning', 'error', 'info'] as const).map((v) => (
                <Badge key={v} variant={v} onClick={() => alert(`Clicked: ${v}`)}>
                    {v}
                </Badge>
            ))}
        </div>
    ),
};

export const StatusLabels: Story = {
    render: () => (
        <div className="space-y-3">
            <div className="flex gap-3">
                <Badge variant="success">Active</Badge>
                <Badge variant="error">Inactive</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="info">Draft</Badge>
            </div>
            <div className="flex gap-3">
                <Badge variant="secondary" size="sm">New</Badge>
                <Badge variant="default" size="sm">Updated</Badge>
                <Badge variant="success" size="sm">Verified</Badge>
            </div>
        </div>
    ),
};
