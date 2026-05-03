import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark';
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
      }
      return (
        <div className={isDark ? 'min-h-screen bg-gray-950 p-4' : 'min-h-screen bg-white p-4'}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#ffffff' },
        { name: 'app-dark', value: '#030712' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
