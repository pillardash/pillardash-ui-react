import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CheckBox, { RadioGroup } from './CheckBox';

const meta: Meta<typeof CheckBox> = {
    title: 'Components/Form/CheckBox',
    component: CheckBox,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['check', 'dot', 'toggle'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        labelPosition: {
            control: 'radio',
            options: ['left', 'right'],
        },
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        indeterminate: { control: 'boolean' },
        label: { control: 'text' },
        error: { control: 'text' },
        helpText: { control: 'text' },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof CheckBox>;

export const Playground: Story = {
    args: {
        label: 'Accept terms and conditions',
        variant: 'check',
        size: 'md',
    },
};

export const CheckVariants: Story = {
    render: () => (
        <div className="space-y-6">
            <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Check</h3>
                <div className="flex flex-wrap items-center gap-6">
                    {(['sm', 'md', 'lg'] as const).map((s) => (
                        <CheckBox key={s} variant="check" size={s} label={`Size ${s}`} />
                    ))}
                    <CheckBox variant="check" checked label="Checked" />
                    <CheckBox variant="check" indeterminate label="Indeterminate" />
                    <CheckBox variant="check" disabled label="Disabled" />
                </div>
            </div>

            <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Toggle</h3>
                <div className="flex flex-wrap items-center gap-6">
                    {(['sm', 'md', 'lg'] as const).map((s) => (
                        <CheckBox key={s} variant="toggle" size={s} label={`Size ${s}`} />
                    ))}
                    <CheckBox variant="toggle" checked label="On" />
                    <CheckBox variant="toggle" disabled label="Disabled" />
                </div>
            </div>

            <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Dot (Radio)</h3>
                <div className="flex flex-wrap items-center gap-6">
                    {(['sm', 'md', 'lg'] as const).map((s) => (
                        <CheckBox key={s} variant="dot" size={s} label={`Size ${s}`} />
                    ))}
                    <CheckBox variant="dot" checked label="Selected" />
                    <CheckBox variant="dot" disabled label="Disabled" />
                </div>
            </div>
        </div>
    ),
};

export const WithError: Story = {
    args: {
        label: 'I accept the terms and conditions',
        variant: 'check',
        error: 'You must accept the terms to continue',
        required: true,
    },
};

export const WithHelpText: Story = {
    args: {
        label: 'Subscribe to newsletter',
        variant: 'toggle',
        helpText: 'Get weekly updates about new features and releases.',
        checked: true,
    },
};

export const RadioGroupStory: Story = {
    name: 'RadioGroup',
    render: () => {
        const [value, setValue] = useState('option1');
        return (
            <div className="space-y-6">
                <RadioGroup
                    name="vertical-group"
                    label="Select a class"
                    value={value}
                    onChange={setValue}
                    options={[
                        { value: 'option1', label: 'JSS 1' },
                        { value: 'option2', label: 'JSS 2' },
                        { value: 'option3', label: 'JSS 3' },
                        { value: 'option4', label: 'Disabled option', disabled: true },
                    ]}
                    helpText="Select the class you want to manage"
                />

                <RadioGroup
                    name="horizontal-group"
                    label="Gender"
                    value="male"
                    onChange={() => {}}
                    direction="horizontal"
                    options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                    ]}
                />

                <p className="text-sm text-gray-600">Selected: <strong>{value}</strong></p>
            </div>
        );
    },
};

export const FormExample: Story = {
    render: () => {
        const [formData, setFormData] = useState({ terms: false, newsletter: true, sms: false });
        return (
            <div className="max-w-sm space-y-4 rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
                <CheckBox
                    variant="check"
                    checked={formData.terms}
                    onChange={(v) => setFormData({ ...formData, terms: v })}
                    label="Accept terms and conditions"
                    required
                    error={!formData.terms ? 'Required' : ''}
                />
                <CheckBox
                    variant="toggle"
                    checked={formData.newsletter}
                    onChange={(v) => setFormData({ ...formData, newsletter: v })}
                    label="Email notifications"
                    helpText="Receive weekly digest emails"
                />
                <CheckBox
                    variant="toggle"
                    checked={formData.sms}
                    onChange={(v) => setFormData({ ...formData, sms: v })}
                    label="SMS notifications"
                />
            </div>
        );
    },
};
