import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Select, { SelectOption } from './Select';

const meta: Meta<typeof Select> = {
    title: 'Components/Select',
    component: Select,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A flexible Select component that supports both single and multi-select functionality with search capabilities.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the select component',
        },
        multiple: {
            control: 'boolean',
            description: 'Enable multi-select functionality',
        },
        searchable: {
            control: 'boolean',
            description: 'Enable search functionality',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the select component',
        },
        fullWidth: {
            control: 'boolean',
            description: 'Make the select component full width',
        },
        required: {
            control: 'boolean',
            description: 'Mark the field as required',
        },
        closeOnSelect: {
            control: 'boolean',
            description: 'Close dropdown after selection (multi-select only)',
        },
        showSelectedCount: {
            control: 'boolean',
            description: 'Show count instead of individual items when many selected',
        },
        maxSelected: {
            control: 'number',
            description: 'Maximum number of selectable options (multi-select only)',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text',
        },
        label: {
            control: 'text',
            description: 'Label for the select component',
        },
        helpText: {
            control: 'text',
            description: 'Help text displayed below the component',
        },
        error: {
            control: 'text',
            description: 'Error message to display',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Sample data
const basicOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
];

const subjectOptions: SelectOption[] = [
    { value: 'technical-drawing', label: 'Technical Drawing' },
    { value: 'home-economics', label: 'Home Economics' },
    { value: 'music', label: 'Music' },
    { value: 'fine-art', label: 'Fine Art' },
    { value: 'business-studies', label: 'Business Studies' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English Language' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'geography', label: 'Geography' },
    { value: 'history', label: 'History' },
];

const optionsWithDisabled: SelectOption[] = [
    { value: 'available1', label: 'Available Option 1' },
    { value: 'available2', label: 'Available Option 2' },
    { value: 'disabled1', label: 'Disabled Option 1', disabled: true },
    { value: 'available3', label: 'Available Option 3' },
    { value: 'disabled2', label: 'Disabled Option 2', disabled: true },
];

const longOptions: SelectOption[] = Array.from({ length: 50 }, (_, i) => ({
    value: `option-${i + 1}`,
    label: `Option ${i + 1} - This is a longer label to test text handling`,
}));

const ControlledSelect = (args: any) => {
    const [value, setValue] = useState(args.value || (args.multiple ? [] : ''));

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(event.target.value);
        args.onChange(event); // This will log to Actions panel
    };

    return <Select {...args} value={value} onChange={handleChange} />;
};

// Stories
export const Default: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        placeholder: 'Select an option',
    },
};

export const WithLabel: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Choose an option',
        placeholder: 'Select an option',
        helpText: 'This is a helpful description of what to select.',
    },
};

export const Required: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Required Field',
        placeholder: 'Select an option',
        required: true,
        helpText: 'This field is required.',
    },
};

export const WithError: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Field with Error',
        placeholder: 'Select an option',
        error: 'Please select a valid option.',
    },
};

export const Disabled: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Disabled Select',
        placeholder: 'This is disabled',
        disabled: true,
    },
};

export const Searchable: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: subjectOptions,
        label: 'Searchable Select',
        placeholder: 'Search and select...',
        searchable: true,
        helpText: 'Type to search through options.',
    },
};

export const MultiSelect: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: subjectOptions,
        label: 'Multi-Select',
        placeholder: 'Select multiple subjects',
        multiple: true,
        helpText: 'You can select multiple subjects.',
    },
};

export const MultiSelectWithSearch: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: subjectOptions,
        label: 'Multi-Select with Search',
        placeholder: 'Search and select subjects',
        multiple: true,
        searchable: true,
        helpText: 'Search and select multiple subjects.',
    },
};

export const MultiSelectWithLimit: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: subjectOptions,
        label: 'Limited Multi-Select',
        placeholder: 'Select up to 3 subjects',
        multiple: true,
        searchable: true,
        maxSelected: 3,
        helpText: 'You can select up to 3 subjects only.',
    },
};

export const MultiSelectKeepOpen: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: subjectOptions,
        label: 'Multi-Select (Keep Open)',
        placeholder: 'Select subjects',
        multiple: true,
        searchable: true,
        closeOnSelect: false,
        helpText: 'Dropdown stays open for multiple selections.',
    },
};

export const WithDisabledOptions: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: optionsWithDisabled,
        label: 'Select with Disabled Options',
        placeholder: 'Some options are disabled',
        helpText: 'Some options are disabled and cannot be selected.',
    },
};

export const SmallSize: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Small Size',
        placeholder: 'Small select',
        size: 'sm',
    },
};

export const LargeSize: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Large Size',
        placeholder: 'Large select',
        size: 'lg',
    },
};

export const NotFullWidth: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Auto Width',
        placeholder: 'Auto width',
        fullWidth: false,
    },
};

export const WithManyOptions: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: longOptions,
        label: 'Many Options',
        placeholder: 'Select from many options',
        searchable: true,
        helpText: 'This select has 50 options. Use search to find what you need.',
    },
};

export const PreselectedSingle: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Preselected Value',
        value: 'option2',
        helpText: 'This select has a preselected value.',
    },
};

export const PreselectedMultiple: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: subjectOptions,
        label: 'Preselected Multi-Select',
        value: ['technical-drawing', 'music', 'fine-art'],
        multiple: true,
        searchable: true,
        helpText: 'This multi-select has preselected values.',
    },
};

export const WithCustomClassName: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: basicOptions,
        label: 'Custom Styling',
        placeholder: 'Custom styled select',
        className: 'border-purple-500 focus:ring-purple-500 focus:border-purple-500',
        helpText: 'This select has custom purple styling.',
    },
};

// Playground story for testing all props
export const Playground: Story = {
    render: (args) => <ControlledSelect {...args} />,
    args: {
        options: subjectOptions,
        label: 'Playground Select',
        placeholder: 'Configure me using controls',
        helpText: 'Use the controls panel to test different configurations.',
        size: 'md',
        multiple: false,
        searchable: false,
        disabled: false,
        fullWidth: true,
        required: false,
        closeOnSelect: true,
        showSelectedCount: false,
    },
};

// Form integration example
export const FormIntegration: Story = {
    render: () => {
        const [formData, setFormData] = useState({
            subject: '',
            subjects: [] as string[],
            level: '',
        });

        const handleSingleChange = (field: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
            setFormData(prev => ({
                ...prev,
                [field]: event.target.value
            }));
        };

        const handleMultiChange = (field: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
            setFormData(prev => ({
                ...prev,
                [field]: event.target.value
            }));
        };

        return (
            <div className="space-y-6 p-6 max-w-md">
                <h3 className="text-lg font-semibold mb-4">Sample Form</h3>

                <Select
                    options={[
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' },
                    ]}
                    label="Level"
                    placeholder="Select your level"
                    value={formData.level}
                    onChange={handleSingleChange('level')}
                    required
                />

                <Select
                    options={subjectOptions}
                    label="Primary Subject"
                    placeholder="Select primary subject"
                    value={formData.subject}
                    onChange={handleSingleChange('subject')}
                    searchable
                    required
                />

                <Select
                    options={subjectOptions}
                    label="Additional Subjects"
                    placeholder="Select additional subjects"
                    value={formData.subjects}
                    onChange={handleMultiChange('subjects')}
                    multiple
                    searchable
                    maxSelected={5}
                    helpText="Select up to 5 additional subjects"
                />

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Form Data:</h4>
                    <pre className="text-sm text-gray-600">
            {JSON.stringify(formData, null, 2)}
          </pre>
                </div>
            </div>
        );
    },
    parameters: {
        layout: 'fullscreen',
    },
};