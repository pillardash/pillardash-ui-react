import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Star } from 'lucide-react';
import Button from './Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'dark', 'neutral', 'danger', 'default'],
        },
        size: {
            control: 'radio',
            options: ['xs', 'sm', 'md', 'lg'],
        },
        iconPosition: {
            control: 'radio',
            options: ['left', 'right'],
        },
        icon: { control: false },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {
    args: {
        children: 'Button',
        variant: 'primary',
        size: 'md',
    },
};

export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
                {(['primary', 'secondary', 'dark', 'neutral', 'danger', 'default'] as const).map((v) => (
                    <Button key={v} variant={v}>{v}</Button>
                ))}
            </div>
            <div className="flex flex-wrap gap-3">
                {(['primary', 'secondary', 'dark', 'neutral', 'danger', 'default'] as const).map((v) => (
                    <Button key={v} variant={v} outline>{v} outline</Button>
                ))}
            </div>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                <Button key={s} size={s}>{s}</Button>
            ))}
        </div>
    ),
};

export const WithIconLeft: Story = {
    args: {
        children: 'Favourite',
        icon: <Star size={16} />,
        iconPosition: 'left',
    },
};

export const WithIconRight: Story = {
    args: {
        children: 'Continue',
        icon: <ArrowRight size={16} />,
        iconPosition: 'right',
    },
};

export const Loading: Story = {
    args: {
        children: 'Processing...',
        loading: true,
    },
};

export const Disabled: Story = {
    args: {
        children: 'Unavailable',
        disabled: true,
    },
};
