# Pillardash Component Library

A collection of reusable React components for building modern web applications with consistent design and behavior.

## Features

- **TypeScript Support**: Fully typed components with exported prop types
- **Accessible**: Built with WAI-ARIA standards
- **Customizable**: Theme support and style overrides
- **Responsive**: Works across all device sizes
- **Form Components**: Complete suite of form inputs and controls

## Installation

```bash
npm install pillardash-ui-react
# or
yarn add pillardash-ui-react
```

## Quick Start

Import the package stylesheet once in your app entry file (for example, `main.tsx`, `index.tsx`, or `app.tsx`):

```tsx
import "pillardash-ui-react/styles.css";
```

Then use components normally:

```tsx
import { Button, Input } from "pillardash-ui-react";

function Example() {
  return (
    <div>
      <Input label="Email" placeholder="Enter your email" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

## Peer Dependencies

This library requires:

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

## Available Components

### Form Controls
- `Button` - Interactive button element
- `CheckBox` - Custom checkbox input
- `FileUpload` - File upload component with drag-and-drop
- `Input` - Text input field
- `Search` - Search input with debounce
- `Select` - Custom select dropdown
- `TextEditor` - Rich text editor

### Data Display
- `DataTable` - Sortable and paginated table
- `Card` - Flexible content container

### Feedback
- `Alert` - Contextual notification messages
- `Loading` - Animated loading indicators

## Theming

You can customize core brand colors with CSS variables (no Tailwind config required):

```css
:root {
  --pd-primary: 14 138 116;
  --pd-primary-50: 240 253 250;
  --pd-primary-100: 204 251 241;
  --pd-primary-400: 45 212 191;
  --pd-primary-500: 20 184 166;
  --pd-primary-600: 13 148 136;
  --pd-primary-700: 15 118 110;
  --pd-primary-800: 17 94 89;
  --pd-primary-900: 19 78 74;
  --pd-secondary: 14 138 170;
  --pd-dark: 31 41 55;
}
```

Each variable uses `R G B` channel values so alpha utilities continue to work.

## Optional Tailwind Integration

If your app uses Tailwind, you can still extend or override styles in your own config. This package no longer requires adding `node_modules/pillardash-ui-react` to `content` for default usage.

## TypeScript Support

All components include TypeScript definitions. Import prop types for extended customization:

```tsx
import { Button, type ButtonProps } from "pillardash-ui-react";

const CustomButton = (props: ButtonProps) => (
  <Button {...props} className="custom-class" />
);
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

## License

MIT © [Osai Technologies](https://osaitech.dev)

---

## Component Documentation

### Button

```tsx
<Button
  variant="primary" | "secondary" | "dark" | "neutral" | "danger" | "default"
  size="xs" | "sm" | "md" | "lg"
  loading={boolean}
  disabled={boolean}
  outline={boolean}
  icon={ReactNode}
  iconPosition="left" | "right"
  onClick={() => void}
>
  Click me
</Button>
```

> **Note:** `TextEditor` and `ExportButton` require `lucide-react` and `@tiptap/*` packages. Install them only if you use those components:
>
> ```bash
> npm install lucide-react @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-underline @tiptap/extension-image
> ```

### Input

```tsx
<Input
  label="Email"
  placeholder="user@example.com"
  error="Invalid email"
  value={string}
  onChange={(e) => void}
/>
```

### Select

```tsx
<Select
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  value={string}
  onChange={(selected) => void}
/>
```

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run Storybook: `npm run storybook`
4. Build the library: `npm run build`

