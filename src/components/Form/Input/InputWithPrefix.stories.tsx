import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ChevronDown, DollarSign, Phone } from 'lucide-react';
import InputWithPrefix from './InputWithPrefix';

const meta: Meta<typeof InputWithPrefix> = {
    title: 'Components/Form/InputWithPrefix',
    component: InputWithPrefix,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
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
type Story = StoryObj<typeof InputWithPrefix>;

export const PhoneWithCountryCode: Story = {
    render: () => {
        const [phone, setPhone] = useState('');
        const [country, setCountry] = useState('+234');
        const countries = [
            { code: '+234', flag: '🇳🇬' },
            { code: '+1', flag: '🇺🇸' },
            { code: '+44', flag: '🇬🇧' },
        ];
        return (
            <InputWithPrefix
                label="Phone Number"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="h-4 w-4 text-gray-400" />}
                iconPosition="right"
                prefixContent={
                    <div className="flex items-center">
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 pr-1"
                        >
                            {countries.map((c) => (
                                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                            ))}
                        </select>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                }
                prefixClassName="min-w-[110px] justify-between"
                required
            />
        );
    },
};

export const AmountWithCurrency: Story = {
    render: () => {
        const [amount, setAmount] = useState('');
        const [currency, setCurrency] = useState('NGN');
        return (
            <InputWithPrefix
                label="Amount"
                placeholder="0.00"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                prefixContent={
                    <div className="flex items-center">
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 pr-1"
                        >
                            {['NGN', 'USD', 'EUR', 'GBP'].map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                }
                prefixClassName="min-w-[80px] justify-between"
            />
        );
    },
};

export const StaticPrefix: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <InputWithPrefix
                label="Price"
                placeholder="0.00"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                prefixContent={<DollarSign className="h-4 w-4 text-gray-600" />}
                prefixClassName="min-w-[44px] justify-center"
            />
        );
    },
};

export const UsernamePrefix: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <InputWithPrefix
                label="Username"
                placeholder="your-username"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                prefixContent={<span className="text-gray-600 font-medium">@</span>}
                helpText="Choose a unique username"
            />
        );
    },
};

export const URLPrefix: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <InputWithPrefix
                label="Website"
                placeholder="your-site"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                prefixContent={
                    <span className="text-blue-600 font-medium text-sm">https://</span>
                }
                prefixClassName="min-w-[80px]"
            />
        );
    },
};

export const WithError: Story = {
    render: () => (
        <InputWithPrefix
            label="Phone Number"
            placeholder="Enter phone number"
            value=""
            onChange={() => {}}
            error="Please enter a valid phone number"
            prefixContent={<span className="text-gray-600 font-medium">+234</span>}
        />
    ),
};
