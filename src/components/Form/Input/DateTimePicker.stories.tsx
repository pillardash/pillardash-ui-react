import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DateTimePicker, { DateTimeValue } from './DateTimePicker';

const meta: Meta<typeof DateTimePicker> = {
    title: 'Components/Form/DateTimePicker',
    component: DateTimePicker,
    tags: ['autodocs'],
    argTypes: {
        mode: {
            control: 'select',
            options: ['date', 'datetime', 'daterange', 'datetimerange'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        label: { control: 'text' },
        placeholder: { control: 'text' },
        error: { control: 'text' },
        helpText: { control: 'text' },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const SingleDate: Story = {
    render: () => {
        const [value, setValue] = useState<DateTimeValue>({});
        return (
            <div className="max-w-sm">
                <DateTimePicker
                    label="Date of Birth"
                    mode="date"
                    value={value}
                    onChange={setValue}
                    placeholder="Select a date"
                    helpText="Choose any single date"
                />
                {value.startDate && (
                    <p className="text-sm text-gray-600">Selected: {value.startDate.toLocaleDateString()}</p>
                )}
            </div>
        );
    },
};

export const DateTime: Story = {
    render: () => {
        const [value, setValue] = useState<DateTimeValue>({});
        return (
            <div className="max-w-sm">
                <DateTimePicker
                    label="Appointment Date & Time"
                    mode="datetime"
                    value={value}
                    onChange={setValue}
                    placeholder="Select date and time"
                    helpText="Choose date with specific time"
                />
            </div>
        );
    },
};

export const DateRange: Story = {
    render: () => {
        const [value, setValue] = useState<DateTimeValue>({});
        return (
            <div className="max-w-sm">
                <DateTimePicker
                    label="Term Period"
                    mode="daterange"
                    value={value}
                    onChange={setValue}
                    placeholder="Select date range"
                    helpText="Click start date then end date"
                />
                {value.startDate && value.endDate && (
                    <p className="text-sm text-gray-600">
                        {value.startDate.toLocaleDateString()} — {value.endDate.toLocaleDateString()}
                    </p>
                )}
            </div>
        );
    },
};

export const DateTimeRange: Story = {
    render: () => {
        const [value, setValue] = useState<DateTimeValue>({});
        return (
            <div className="max-w-sm">
                <DateTimePicker
                    label="Event Duration"
                    mode="datetimerange"
                    value={value}
                    onChange={setValue}
                    placeholder="Select date and time range"
                />
            </div>
        );
    },
};

export const AllModes: Story = {
    render: () => {
        const [values, setValues] = useState<Record<string, DateTimeValue>>({
            date: {},
            datetime: {},
            daterange: {},
            datetimerange: {},
        });
        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-2xl">
                {(['date', 'datetime', 'daterange', 'datetimerange'] as const).map((mode) => (
                    <DateTimePicker
                        key={mode}
                        label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                        mode={mode}
                        value={values[mode]}
                        onChange={(v) => setValues({ ...values, [mode]: v })}
                        placeholder={`Select ${mode}...`}
                    />
                ))}
            </div>
        );
    },
};

export const WithError: Story = {
    render: () => {
        const [value, setValue] = useState<DateTimeValue>({});
        return (
            <div className="max-w-sm">
                <DateTimePicker
                    label="Start Date"
                    mode="date"
                    value={value}
                    onChange={setValue}
                    error="Start date is required"
                    required
                />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <div className="max-w-sm">
            <DateTimePicker
                label="Locked Date"
                mode="date"
                value={{ startDate: new Date() }}
                onChange={() => {}}
                disabled
            />
        </div>
    ),
};

export const Sizes: Story = {
    render: () => {
        const [value, setValue] = useState<DateTimeValue>({});
        return (
            <div className="max-w-sm space-y-4">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                    <DateTimePicker
                        key={s}
                        label={`Size ${s}`}
                        mode="date"
                        size={s}
                        value={value}
                        onChange={setValue}
                        placeholder={`Size ${s}`}
                    />
                ))}
            </div>
        );
    },
};
