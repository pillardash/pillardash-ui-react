import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FileUpload from './FileUpload';

const meta: Meta<typeof FileUpload> = {
    title: 'Components/Form/FileUpload',
    component: FileUpload,
    tags: ['autodocs'],
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
        placeholder: { control: 'text' },
        error: { control: 'text' },
        helperText: { control: 'text' },
        accept: { control: 'text' },
        maxFileSize: { control: 'text' },
        onFileChange: { action: 'file changed' },
    },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[] | null>(null);
        return (
            <div className="max-w-lg">
                <FileUpload {...args} onFileChange={setFiles} />
                {files && (
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: {files.map((f) => f.name).join(', ')}
                    </p>
                )}
            </div>
        );
    },
    args: {
        label: 'Upload File',
        helperText: 'Drag and drop or click to upload',
    },
};

export const SingleFile: Story = {
    render: () => {
        const [file, setFile] = useState<File[] | null>(null);
        return (
            <div className="max-w-lg">
                <FileUpload
                    label="Upload Document"
                    description="Upload a single document file"
                    helperText="Supported: PDF, DOC, DOCX"
                    accept=".pdf,.doc,.docx"
                    multiple={false}
                    onFileChange={setFile}
                    maxFileSize="10"
                />
            </div>
        );
    },
};

export const MultipleFiles: Story = {
    render: () => {
        const [files, setFiles] = useState<File[] | null>(null);
        return (
            <div className="max-w-lg">
                <FileUpload
                    label="Upload Files"
                    description="Select multiple files"
                    helperText="Hold Ctrl/Cmd to select multiple"
                    multiple
                    onFileChange={setFiles}
                />
            </div>
        );
    },
};

export const ImagesOnly: Story = {
    render: () => (
        <div className="max-w-lg">
            <FileUpload
                label="Upload Images"
                accept="image/*"
                multiple
                direction="row"
                onFileChange={() => {}}
                placeholder="Choose images"
                helperText="PNG, JPG, WEBP supported"
            />
        </div>
    ),
};

export const WithError: Story = {
    args: {
        label: 'Upload Document',
        error: 'File size too large. Please select a file smaller than 5MB.',
        onFileChange: () => {},
    },
    render: (args) => (
        <div className="max-w-lg">
            <FileUpload {...args} />
        </div>
    ),
};

export const WithSuccess: Story = {
    args: {
        label: 'Upload Document',
        success: 'File uploaded successfully!',
        onFileChange: () => {},
    },
    render: (args) => (
        <div className="max-w-lg">
            <FileUpload {...args} />
        </div>
    ),
};

export const Disabled: Story = {
    args: {
        label: 'Upload (Disabled)',
        disabled: true,
        onFileChange: () => {},
    },
    render: (args) => (
        <div className="max-w-lg">
            <FileUpload {...args} />
        </div>
    ),
};
