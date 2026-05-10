# pillardash-ui-react — AI Usage Guide

## Purpose

`pillardash-ui-react` is the shared reusable UI component library for Pennup apps. When working in a consumer app, check this package before creating reusable UI elements locally.

## Reuse Convention

- Prefer this package for reusable primitives and common UI patterns: buttons, cards, forms, modals, tables, badges, alerts, skeletons, loaders, navigation helpers, document viewers, and editors.
- Do not hand-roll local reusable components in consumer apps when an equivalent exists here.
- If a needed reusable UI primitive does not exist here, consider adding it to this package instead of duplicating it in an app.
- Check both root exports and subpath exports before assuming a component is unavailable.

## Root Import

Import these from `pillardash-ui-react`:

```tsx
import {
  Badge,
  Button,
  Card,
  CheckBox,
  ConfirmationAlert,
  EmptyStateCard,
  FileUpload,
  Input,
  Modal,
  Search,
  Select,
  SelectButton,
  SkeletonCard,
  Table,
  TableDropdown,
  alert,
} from "pillardash-ui-react";
```

Available root exports include:

- Buttons: `Button`, `ExportButton`
- Cards: `Card`, `EmptyStateCard`
- Forms: `CheckBox`, `RadioGroup`, `FileUpload`, `Input`, `InputWithPrefix`, `TagInput`, `DateTimePicker`, `Search`, `Select`, `SelectButton`
- Feedback: `alert`, `AlertProvider`, `useAlert`, `AlertContext`, `ConfirmationAlert`
- Modal: `Modal`
- Table: `Table`, `Pagination`, `TableSkeleton`, `TableDropdown`
- Skeletons: `SkeletonLoader`, `SkeletonText`, `SkeletonAvatar`, `SkeletonButton`, `SkeletonCard`, `SkeletonImage`, `SkeletonProfile`, `SkeletonList`, `SkeletonTable`, `CardStatsSkeleton`
- Loading: `Loading`
- Navigation: `Breadcrumb`, `Tooltip`
- Display: `Badge`, `FileView`

## Subpath Exports

`TextEditor` is intentionally exported from a subpath because it has heavier optional peer dependencies:

```tsx
import { TextEditor } from "pillardash-ui-react/text-editor";
```

Do not import `TextEditor` from `pillardash-ui-react`.

## Consumer App Rule

When generating UI in a Pennup app, first ask: “Can this be built with `pillardash-ui-react`?” Use the package component unless there is a specific product requirement that the library cannot satisfy.
