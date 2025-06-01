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
npm install @your-org/component-library
# or
yarn add @your-org/component-library
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

## Usage

```tsx
import { Button, Input } from '@your-org/component-library';

function Example() {
  return (
    <div>
      <Input 
        label="Email" 
        placeholder="Enter your email" 
      />
      <Button variant="primary">
        Submit
      </Button>
    </div>
  );
}
```

## Theming

Customize the look and feel by wrapping your app with the `ThemeProvider`:

```tsx
import { ThemeProvider } from '@your-org/component-library';

function App() {
  return (
    <ThemeProvider
      theme={{
        colors: {
          primary: '#0E8A74',
          secondary: '#0E8AAA'
        }
      }}
    >
      {/* Your app */}
    </ThemeProvider>
  );
}
```

## TypeScript Support

All components include TypeScript definitions. Import prop types for extended customization:

```tsx
import { Button, type ButtonProps } from '@your-org/component-library';

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
  variant="primary" | "secondary" | "outline"
  size="sm" | "md" | "lg"
  loading={boolean}
  disabled={boolean}
  onClick={() => void}
>
  Click me
</Button>
```

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

## Testing

```bash
npm test
# or
npm run test:watch
```