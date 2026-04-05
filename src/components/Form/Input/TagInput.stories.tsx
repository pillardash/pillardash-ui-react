import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TagInput from './TagInput';
import type { Tag } from './TagInput';

const meta: Meta<typeof TagInput> = {
    title: 'Components/Form/TagInput',
    component: TagInput,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        allowCustomTags: { control: 'boolean' },
        maxTags: { control: 'number' },
        label: { control: 'text' },
        placeholder: { control: 'text' },
        error: { control: 'text' },
        helpText: { control: 'text' },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

const techTags: Tag[] = [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'css', label: 'CSS' },
    { value: 'nextjs', label: 'Next.js' },
];

const subjectTags: Tag[] = [
    { value: 'math', label: 'Mathematics' },
    { value: 'english', label: 'English' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
];

export const Playground: Story = {
    render: (args) => {
        const [tags, setTags] = useState<string[]>([]);
        return <TagInput {...args} value={tags} onChange={setTags} />;
    },
    args: {
        label: 'Tags',
        placeholder: 'Type to add tags...',
        predefinedTags: techTags,
    },
};

export const WithPredefinedTags: Story = {
    render: () => {
        const [tags, setTags] = useState<string[]>(['react', 'typescript']);
        return (
            <TagInput
                label="Skills & Technologies"
                value={tags}
                onChange={setTags}
                predefinedTags={techTags}
                placeholder="Search or add skills..."
                helpText="Select from predefined options or type your own"
            />
        );
    },
};

export const CustomTagsOnly: Story = {
    render: () => {
        const [tags, setTags] = useState<string[]>([]);
        return (
            <TagInput
                label="Custom Labels"
                value={tags}
                onChange={setTags}
                placeholder="Type and press Enter to add..."
                helpText="Type any value and press Enter to create a tag"
            />
        );
    },
};

export const PredefinedOnly: Story = {
    render: () => {
        const [tags, setTags] = useState<string[]>([]);
        return (
            <TagInput
                label="Subjects"
                value={tags}
                onChange={setTags}
                predefinedTags={subjectTags}
                allowCustomTags={false}
                placeholder="Select subjects..."
                helpText="Only predefined subjects can be selected"
            />
        );
    },
};

export const WithMaxTags: Story = {
    render: () => {
        const [tags, setTags] = useState<string[]>(['react']);
        return (
            <TagInput
                label="Skills (max 3)"
                value={tags}
                onChange={setTags}
                predefinedTags={techTags}
                maxTags={3}
                placeholder="Add up to 3 skills..."
                helpText="Maximum 3 skills allowed"
            />
        );
    },
};

export const CustomColors: Story = {
    render: () => {
        const [tags, setTags] = useState<string[]>(['web', 'mobile']);
        return (
            <TagInput
                label="Project Categories"
                value={tags}
                onChange={setTags}
                predefinedTags={[
                    { value: 'web', label: 'Web Dev' },
                    { value: 'mobile', label: 'Mobile' },
                    { value: 'ai', label: 'AI/ML' },
                    { value: 'design', label: 'Design' },
                ]}
                tagBackgroundColor="bg-purple-500"
                tagTextColor="text-white"
                size="lg"
            />
        );
    },
};

export const WithError: Story = {
    render: () => {
        const [tags, setTags] = useState<string[]>([]);
        return (
            <TagInput
                label="Required Tags"
                value={tags}
                onChange={setTags}
                predefinedTags={techTags}
                error="At least one skill is required"
                required
            />
        );
    },
};
