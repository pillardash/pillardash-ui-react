import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta: Meta<typeof Card> = {
    title: 'Components/Cards/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'elevated', 'outline', 'glass', 'premium'],
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
        },
        glass: { control: 'boolean' },
        className: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: (
            <div>
                <h3 className="text-lg font-semibold text-gray-950 dark:text-white">Card Title</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">This is a cleaner card surface with a subtle border and softer shadow.</p>
            </div>
        ),
    },
};

export const Premium: Story = {
    render: () => (
        <Card variant="premium" className="max-w-md">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Overview</p>
                    <h3 className="mt-3 text-xl font-semibold text-gray-950 dark:text-white">Academic Progress</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        A refined card treatment for important dashboard moments without adding visual noise.
                    </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">92%</span>
            </div>
        </Card>
    ),
};

export const Variants: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
                { variant: 'default', title: 'Default', copy: 'Balanced for everyday surfaces.' },
                { variant: 'elevated', title: 'Elevated', copy: 'More presence for key widgets.' },
                { variant: 'outline', title: 'Outline', copy: 'Quiet layout grouping.' },
            ].map((item) => (
                <Card key={item.variant} variant={item.variant as 'default' | 'elevated' | 'outline'}>
                    <h3 className="font-semibold text-gray-950 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{item.copy}</p>
                </Card>
            ))}
        </div>
    ),
};

export const GlassEffect: Story = {
    render: () => (
        <div
            className="flex items-center justify-center rounded-xl p-12"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
            <Card glass className="max-w-sm">
                <h3 className="text-lg font-semibold text-white">Glass Card</h3>
                <p className="mt-2 text-sm text-white/80">
                    This card uses backdrop blur and glass morphism effect.
                </p>
            </Card>
        </div>
    ),
};

export const WithStats: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
                { label: 'Total Students', value: '1,248', color: 'text-blue-600' },
                { label: 'Active Classes', value: '24', color: 'text-green-600' },
                { label: 'Pending Tasks', value: '7', color: 'text-amber-600' },
            ].map((stat) => (
                <Card key={stat.label}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className={`mt-1 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </Card>
            ))}
        </div>
    ),
};

export const WithContent: Story = {
    render: () => (
        <Card className="max-w-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-950 dark:text-white">Recent Activity</h3>
                <span className="text-sm text-blue-600 cursor-pointer">View all</span>
            </div>
            <div className="space-y-3">
                {['Assignment submitted', 'New student enrolled', 'Attendance marked'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                        {item}
                    </div>
                ))}
            </div>
        </Card>
    ),
};
