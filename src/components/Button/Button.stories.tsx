import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'], // Enables automatic documentation
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'dark', 'neutral']
        },
        size: {
            control: 'radio',
            options: ['small', 'medium', 'large']
        }
    }
};

export default meta;

// Interactive stories
export const Primary: StoryObj<typeof Button> = {
    args: {
        children: 'Click me',
        variant: 'primary'
    }
};

export const LoadingButton: StoryObj<typeof Button> = {
    args: {
        loading: true,
        children: 'Processing...'
    }
};