import type { Meta, StoryObj } from '@storybook/react';
import SkeletonLoader, {
    SkeletonText,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonCard,
    SkeletonProfile,
    SkeletonList,
    SkeletonTable,
} from './SkeletonLoader';

const meta: Meta<typeof SkeletonLoader> = {
    title: 'Components/SkeletonLoader',
    component: SkeletonLoader,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['text', 'rectangular', 'circular', 'rounded', 'card', 'avatar', 'button', 'image', 'line'],
        },
        animation: {
            control: 'radio',
            options: ['pulse', 'wave', 'none'],
        },
        size: {
            control: 'radio',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        intensity: {
            control: 'radio',
            options: ['light', 'medium', 'dark'],
        },
        count: { control: 'number' },
        shimmer: { control: 'boolean' },
        width: { control: 'text' },
        height: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof SkeletonLoader>;

export const Playground: Story = {
    args: {
        variant: 'text',
        animation: 'pulse',
        width: '200px',
    },
};

export const Variants: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 max-w-2xl">
            {(['text', 'rectangular', 'circular', 'rounded', 'avatar', 'button', 'image', 'line'] as const).map((v) => (
                <div key={v} className="space-y-2">
                    <span className="text-xs text-gray-500 capitalize">{v}</span>
                    <SkeletonLoader variant={v} />
                </div>
            ))}
        </div>
    ),
};

export const MultipleLines: Story = {
    render: () => (
        <div className="max-w-md space-y-4">
            <SkeletonText count={3} />
            <SkeletonText width="75%" />
        </div>
    ),
};

export const ProfileLayout: Story = {
    render: () => (
        <div className="max-w-md p-4">
            <SkeletonProfile showBio />
        </div>
    ),
};

export const ListLayout: Story = {
    render: () => (
        <div className="max-w-md p-4">
            <SkeletonList itemCount={5} showAvatar showMeta />
        </div>
    ),
};

export const TableLayout: Story = {
    render: () => (
        <div className="max-w-2xl p-4">
            <SkeletonTable rows={6} columns={4} showHeader />
        </div>
    ),
};

export const CardAndButton: Story = {
    render: () => (
        <div className="max-w-sm space-y-4 p-4">
            <SkeletonCard />
            <div className="flex gap-3">
                <SkeletonButton />
                <SkeletonButton animation="wave" />
            </div>
            <SkeletonAvatar size="lg" />
        </div>
    ),
};

export const DashboardSkeleton: Story = {
    render: () => (
        <div className="max-w-3xl space-y-6 p-6">
            <div className="flex items-center gap-4">
                <SkeletonAvatar size="lg" />
                <div className="flex-1 space-y-2">
                    <SkeletonText width="40%" height="1.5rem" />
                    <SkeletonText width="60%" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <SkeletonLoader key={i} variant="card" />
                ))}
            </div>
            <SkeletonTable rows={5} columns={4} />
        </div>
    ),
};
