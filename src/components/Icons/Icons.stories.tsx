import type { Meta, StoryObj } from '@storybook/react';
import AssignmentIcon from './AssignmentIcon';
import AttendanceIcon from './AttendanceIcon';
import BellIcon from './BellIcon';
import CollapseIcon from './CollapseIcon';
import DashboardIcon from './DashboardIcon';
import DiscListIcon from './DiscListIcon';
import EnvelopeIcon from './EnvelopeIcon';
import EyeIcon from './EyeIcon';
import EyeOffIcon from './EyeOffIcon';
import FeePaymentIcon from './FeePaymentIcon';
import LockIcon from './LockIcon';
import MessageIcon from './MessageIcon';
import MessagingIcon from './MessagingIcon';
import NavCollapseIcon from './NavCollapseIcon';
import NumberListIcon from './NumberListIcon';
import PadlockIcon from './PadlockIcon';
import PhoneIcon from './PhoneIcon';
import ProfileIcon from './ProfileIcon';
import ResultIcon from './ResultIcon';
import SettingsIcon from './SettingsIcon';
import SubjectIcon from './SubjectIcon';
import SwitchOffIcon from './SwitchOffIcon';
import SwitchOnIcon from './SwitchOnIcon';
import TimeTableIcon from './TimeTableIcon';

const allIcons = [
    { name: 'AssignmentIcon', component: AssignmentIcon },
    { name: 'AttendanceIcon', component: AttendanceIcon },
    { name: 'BellIcon', component: BellIcon },
    { name: 'CollapseIcon', component: CollapseIcon },
    { name: 'DashboardIcon', component: DashboardIcon },
    { name: 'DiscListIcon', component: DiscListIcon },
    { name: 'EnvelopeIcon', component: EnvelopeIcon },
    { name: 'EyeIcon', component: EyeIcon },
    { name: 'EyeOffIcon', component: EyeOffIcon },
    { name: 'FeePaymentIcon', component: FeePaymentIcon },
    { name: 'LockIcon', component: LockIcon },
    { name: 'MessageIcon', component: MessageIcon },
    { name: 'MessagingIcon', component: MessagingIcon },
    { name: 'NavCollapseIcon', component: NavCollapseIcon },
    { name: 'NumberListIcon', component: NumberListIcon },
    { name: 'PadlockIcon', component: PadlockIcon },
    { name: 'PhoneIcon', component: PhoneIcon },
    { name: 'ProfileIcon', component: ProfileIcon },
    { name: 'ResultIcon', component: ResultIcon },
    { name: 'SettingsIcon', component: SettingsIcon },
    { name: 'SubjectIcon', component: SubjectIcon },
    { name: 'SwitchOffIcon', component: SwitchOffIcon },
    { name: 'SwitchOnIcon', component: SwitchOnIcon },
    { name: 'TimeTableIcon', component: TimeTableIcon },
];

// Use a simple div as the default export component for the meta
const IconsGallery = () => (
    <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-8">
        {allIcons.map(({ name, component: Icon }) => (
            <div key={name} className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                    <Icon />
                </div>
                <span className="text-center text-xs text-gray-500 leading-tight">{name.replace('Icon', '')}</span>
            </div>
        ))}
    </div>
);

const meta: Meta = {
    title: 'Components/Icons',
    component: IconsGallery,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Custom SVG icon set used throughout the Pillardash UI. All icons use `currentColor` for stroke, making them themeable via CSS `color`.',
            },
        },
    },
};

export default meta;
type Story = StoryObj;

export const Gallery: Story = {
    render: () => <IconsGallery />,
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-end gap-6">
            {[16, 20, 24, 32, 48].map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                    <div style={{ width: size, height: size, color: '#374151' }}>
                        <BellIcon />
                    </div>
                    <span className="text-xs text-gray-500">{size}px</span>
                </div>
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div className="flex gap-6">
            {[
                { color: '#3B82F6', label: 'Blue' },
                { color: '#10B981', label: 'Green' },
                { color: '#EF4444', label: 'Red' },
                { color: '#F59E0B', label: 'Amber' },
                { color: '#8B5CF6', label: 'Purple' },
            ].map(({ color, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                    <div style={{ color }}>
                        <BellIcon />
                    </div>
                    <span className="text-xs text-gray-500">{label}</span>
                </div>
            ))}
        </div>
    ),
};

export const NavigationSet: Story = {
    render: () => (
        <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-4">
            <nav className="space-y-1">
                {[
                    { icon: DashboardIcon, label: 'Dashboard' },
                    { icon: ProfileIcon, label: 'Students' },
                    { icon: AssignmentIcon, label: 'Assignments' },
                    { icon: AttendanceIcon, label: 'Attendance' },
                    { icon: ResultIcon, label: 'Results' },
                    { icon: TimeTableIcon, label: 'Timetable' },
                    { icon: FeePaymentIcon, label: 'Fee Payment' },
                    { icon: SettingsIcon, label: 'Settings' },
                ].map(({ icon: Icon, label }) => (
                    <div
                        key={label}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        <span className="text-gray-500"><Icon /></span>
                        {label}
                    </div>
                ))}
            </nav>
        </div>
    ),
};
