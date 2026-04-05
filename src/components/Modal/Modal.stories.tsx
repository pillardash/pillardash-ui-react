import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';
import Button from '../Button/Button';

const meta: Meta<typeof Modal> = {
    title: 'Components/Modal',
    component: Modal,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A flexible modal with support for left/right/center positioning, multiple sizes, and optional footer.',
            },
        },
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
        },
        position: {
            control: 'radio',
            options: ['left', 'right', 'center'],
        },
        showCloseButton: { control: 'boolean' },
        closeOnOverlayClick: { control: 'boolean' },
        closeOnEscape: { control: 'boolean' },
        maxHeight: { control: 'boolean' },
        onClose: { action: 'closed' },
    },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalWrapper = ({ size, position, title, children, ...args }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                {...args}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                size={size}
                position={position}
                title={title}
            >
                {children}
            </Modal>
        </div>
    );
};

export const CenterModal: Story = {
    render: () => (
        <ModalWrapper size="md" position="center" title="Center Modal">
            <div className="space-y-3">
                <p className="text-gray-600">This modal is centered on the screen.</p>
                <p className="text-gray-600">It supports any content you need to display.</p>
            </div>
        </ModalWrapper>
    ),
};

export const RightDrawer: Story = {
    render: () => (
        <ModalWrapper size="md" position="right" title="Right Drawer" maxHeight>
            <div className="space-y-3">
                <p className="text-gray-600">This modal slides in from the right like a drawer.</p>
                {Array.from({ length: 10 }, (_, i) => (
                    <p key={i} className="text-gray-500 text-sm">Content row {i + 1}</p>
                ))}
            </div>
        </ModalWrapper>
    ),
};

export const LeftDrawer: Story = {
    render: () => (
        <ModalWrapper size="sm" position="left" title="Left Panel" maxHeight>
            <div className="space-y-4">
                <p className="text-gray-600">This panel slides in from the left.</p>
                {['Dashboard', 'Students', 'Classes', 'Reports', 'Settings'].map((item) => (
                    <div key={item} className="rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100">
                        {item}
                    </div>
                ))}
            </div>
        </ModalWrapper>
    ),
};

export const WithFooter: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        const footer = (
            <div className="flex justify-end gap-3">
                <Button variant="neutral" outline size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>
        );
        return (
            <div>
                <Button onClick={() => setIsOpen(true)}>Open with Footer</Button>
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Edit Profile"
                    size="md"
                    position="center"
                    footer={footer}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm" defaultValue="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm" defaultValue="john@example.com" />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        const [openSize, setOpenSize] = useState<string | null>(null);
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
        return (
            <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                    <Button key={size} size="sm" onClick={() => setOpenSize(size)}>{size}</Button>
                ))}
                {sizes.map((size) => (
                    <Modal
                        key={size}
                        isOpen={openSize === size}
                        onClose={() => setOpenSize(null)}
                        title={`${size.toUpperCase()} Modal`}
                        size={size}
                        position="center"
                    >
                        <p className="text-gray-600">This is a <strong>{size}</strong> sized modal.</p>
                    </Modal>
                ))}
            </div>
        );
    },
};
