import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Mail, Eye, EyeOff, Search, Lock } from 'lucide-react';
import Input from './Input';

const meta: Meta<typeof Input> = {
    title: 'Components/Form/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'textarea'],
        },
        iconPosition: {
            control: 'radio',
            options: ['left', 'right'],
        },
        label: { control: 'text' },
        placeholder: { control: 'text' },
        error: { control: 'text' },
        helpText: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
    },
    args: {
        label: 'Full Name',
        placeholder: 'Enter your full name',
        size: 'md',
    },
};

export const Sizes: Story = {
    render: () => {
        const [values, setValues] = useState({ sm: '', md: '', lg: '' });
        return (
            <div className="space-y-2">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                    <Input
                        key={s}
                        size={s}
                        placeholder={`Size ${s}`}
                        value={values[s]}
                        onChange={(e) => setValues({ ...values, [s]: e.target.value })}
                    />
                ))}
            </div>
        );
    },
};

export const WithIcon: Story = {
    render: () => {
        const [email, setEmail] = useState('');
        const [search, setSearch] = useState('');
        return (
            <div className="space-y-4">
                <Input
                    label="Email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                    iconPosition="left"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    label="Search"
                    placeholder="Search..."
                    icon={<Search className="h-4 w-4 text-gray-400" />}
                    iconPosition="right"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        );
    },
};

export const PasswordField: Story = {
    render: () => {
        const [value, setValue] = useState('');
        const [show, setShow] = useState(false);
        return (
            <Input
                label="Password"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                icon={<Lock className="h-4 w-4 text-gray-400" />}
                iconPosition="left"
                rightIcon={
                    <button onClick={() => setShow(!show)} type="button">
                        {show ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        );
    },
};

export const WithError: Story = {
    render: () => {
        const [value, setValue] = useState('invalid-email');
        return (
            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error="Please enter a valid email address"
                required
            />
        );
    },
};

export const WithHelpText: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <Input
                label="Username"
                placeholder="Choose a username"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                helpText="Username must be 3-20 characters and contain only letters, numbers, and underscores."
            />
        );
    },
};

export const Textarea: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <Input
                label="Description"
                type="textarea"
                placeholder="Enter a description..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                helpText="Maximum 500 characters"
            />
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <Input
            label="Read Only Field"
            value="This field is disabled"
            onChange={() => {}}
            disabled
        />
    ),
};
