import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FileUpload from './FileUploadSingle';

const meta: Meta<typeof FileUpload> = {
    title: 'Components/Form/FileUploadSingle',
    component: FileUpload,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'A simpler file upload component (without existing file management). For the full-featured version see FileUpload.',
            },
        },
    },
    argTypes: {
        multiple: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        showProgress: { control: 'boolean' },
        direction: {
            control: 'radio',
            options: ['row', 'col'],
        },
        label: { control: 'text' },
        error: { control: 'text' },
        helperText: { control: 'text' },
        onFileChange: { action: 'file changed' },
    },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
    render: () => {
        const [files, setFiles] = useState<File[] | null>(null);
        return (
            <div className="max-w-lg">
                <FileUpload
                    label="Upload File"
                    helperText="Drag and drop or click to browse"
                    onFileChange={setFiles}
                />
                {files && (
                    <ul className="mt-2 text-sm text-gray-600">
                        {files.map((f, i) => <li key={i}>• {f.name}</li>)}
                    </ul>
                )}
            </div>
        );
    },
};

export const ImageUpload: Story = {
    render: () => (
        <div className="max-w-lg">
            <FileUpload
                label="Profile Photo"
                accept="image/*"
                multiple={false}
                direction="row"
                onFileChange={() => {}}
                placeholder="Click to upload photo"
                helperText="JPG, PNG, WEBP up to 5MB"
            />
        </div>
    ),
};

export const MultipleFiles: Story = {
    render: () => (
        <div className="max-w-lg">
            <FileUpload
                label="Attachments"
                multiple
                onFileChange={() => {}}
                helperText="Select multiple files at once"
            />
        </div>
    ),
};

export const WithError: Story = {
    render: () => (
        <div className="max-w-lg">
            <FileUpload
                label="Required Document"
                error="Please upload a valid PDF document"
                onFileChange={() => {}}
                accept=".pdf"
            />
        </div>
    ),
};
