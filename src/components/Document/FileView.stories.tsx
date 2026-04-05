import type { Meta, StoryObj } from '@storybook/react';
import FileView from './FileView';
import type { FileItem } from './FileView';

const meta: Meta<typeof FileView> = {
    title: 'Components/FileView',
    component: FileView,
    tags: ['autodocs'],
    argTypes: {
        layout: {
            control: 'radio',
            options: ['grid', 'list'],
        },
        showActions: { control: 'boolean' },
        showDelete: { control: 'boolean' },
        showUpdate: { control: 'boolean' },
        showView: { control: 'boolean' },
        showDownload: { control: 'boolean' },
        onDelete: { action: 'deleted' },
        onUpdate: { action: 'updated' },
        onView: { action: 'viewed' },
        onDownload: { action: 'downloaded' },
    },
};

export default meta;
type Story = StoryObj<typeof FileView>;

const pdfFile: FileItem = {
    id: '1',
    name: 'student-report.pdf',
    size: 1024 * 512,
    type: 'application/pdf',
};

const imageFile: FileItem = {
    id: '2',
    name: 'profile-photo.jpg',
    size: 1024 * 256,
    type: 'image/jpeg',
    url: 'https://picsum.photos/200',
};

const docFile: FileItem = {
    id: '3',
    name: 'assignment.docx',
    size: 1024 * 128,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export const GridPDF: Story = {
    args: {
        file: pdfFile,
        layout: 'grid',
        onDelete: () => {},
        onView: () => {},
    },
};

export const GridImage: Story = {
    args: {
        file: imageFile,
        layout: 'grid',
        onDelete: () => {},
        onView: () => {},
    },
};

export const ListLayout: Story = {
    render: () => (
        <div className="max-w-md space-y-2">
            {[pdfFile, imageFile, docFile].map((file) => (
                <FileView
                    key={file.id}
                    file={file}
                    layout="list"
                    onDelete={() => alert(`Delete ${file.name}`)}
                    onView={() => alert(`View ${file.name}`)}
                    onDownload={() => alert(`Download ${file.name}`)}
                    showDownload
                />
            ))}
        </div>
    ),
};

export const NoFile: Story = {
    args: {
        file: null,
    },
};

export const WithUploadProgress: Story = {
    args: {
        file: {
            name: 'uploading-file.pdf',
            size: 1024 * 1024 * 2,
            type: 'application/pdf',
            uploadProgress: 65,
        },
        layout: 'list',
    },
};
