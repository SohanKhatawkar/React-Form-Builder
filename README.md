# react-form-builder

Layout-driven React form system. Describe **where** fields go (layout) and **what** they are (config) as separate data structures. Pass both to `<Form>` at runtime.

---

## Install

```bash
npm install @your-org/react-form-builder
```

Add the stylesheet once in your app entry:

```ts
import '@your-org/react-form-builder/dist/form.css';
```

---

## Core concept

```
FormLayout       — sections → rows → field IDs   (structure only)
FieldConfigMap   — field ID → full field config   (definition only)
<Form>           — receives both, renders the form
```

Layout and config are **fully decoupled**. You can:
- Reorder fields by editing layout without touching config
- Swap config (e.g. different validation) without touching layout
- Store layout as user-editable JSON (future builder)

---

## Quickstart

```tsx
import { Form } from '@your-org/react-form-builder';
import type { FormLayout, FieldConfigMap } from '@your-org/react-form-builder';

const layout: FormLayout = {
  sections: [
    {
      id: 'contact',
      title: 'Contact details',
      rows: [
        ['firstName', 'lastName'],   // two-column row
        ['email'],                   // full-width
      ],
    },
  ],
};

const fieldConfig: FieldConfigMap = {
  firstName: { id: 'firstName', type: 'text', name: 'firstName', label: 'First name',
    validation: [{ rule: 'required' }] },
  lastName:  { id: 'lastName',  type: 'text', name: 'lastName',  label: 'Last name',
    validation: [{ rule: 'required' }] },
  email:     { id: 'email', type: 'email', name: 'email', label: 'Email',
    validation: [{ rule: 'required' }, { rule: 'email' }] },
};

function ContactForm() {
  return (
    <Form
      layout={layout}
      fieldConfigMap={fieldConfig}
      onSubmit={(values) => console.log(values)}
    >
      <button type="submit">Send</button>
    </Form>
  );
}
```

---

## API

### `<Form>`

| Prop | Type | Description |
|---|---|---|
| `layout` | `FormLayout` | Section/row/ID structure |
| `fieldConfigMap` | `FieldConfigMap` | ID → field config |
| `defaultValues` | `FormValues` | Pre-fill values by field ID |
| `onSubmit` | `(values) => void \| Promise<void>` | Called after validation passes |
| `onChange` | `(values) => void` | Called on every value change |
| `validateOnChange` | `boolean` | Validate on every keystroke (default: blur + post-submit) |
| `children` | `ReactNode` | Rendered below the fields (buttons, etc.) |

---

### `FormLayout`

```ts
interface FormLayout {
  sections: SectionLayout[];
}

interface SectionLayout {
  id: string;
  title?: string;        // Optional heading rendered above rows
  description?: string;  // Optional subtext below heading
  rows: RowLayout[];
}

type RowLayout = string[];   // Array of field IDs
```

**Row column behaviour:**
- 1 field ID → full-width
- 2 field IDs → 50/50 columns
- 3 field IDs → 33/33/33 columns
- Override with `colSpan` on `FieldConfig` (1–12 grid)

---

### `FieldConfig`

```ts
interface FieldConfig {
  id: string;               // Must match layout ID
  type: FieldType;          // See field types below
  name: string;             // Key in submitted form values
  label: string;
  placeholder?: string;
  hint?: string;            // Helper text below input
  defaultValue?: unknown;
  disabled?: boolean;
  readOnly?: boolean;
  colSpan?: number;         // 1–12 (overrides equal-split columns)
  validation?: ValidationRule[];
  options?: SelectOption[]; // For select, multiselect, radio
  props?: Record<string, unknown>;  // Field-type-specific extras
  customType?: string;      // Look up a custom field component by this key
}
```

---

### Field types

| Type | Component | Notes |
|---|---|---|
| `text` | Text input | |
| `email` | Text input | `type="email"` |
| `password` | Text input | `type="password"` |
| `number` | Number input | `props: { min, max, step }` |
| `textarea` | Textarea | `props: { rows }` |
| `select` | Dropdown | Requires `options` |
| `multiselect` | Checkbox group | Requires `options` |
| `radio` | Radio group | Requires `options` |
| `checkbox` | Single checkbox | Value is boolean |
| `toggle` | Toggle switch | Value is boolean |
| `date` | Date picker | `props: { min, max }` |
| `time` | Time picker | |
| `file` | File input | `props: { accept, multiple }` |
| `slider` | Range slider | `props: { min, max, step }` |
| `rating` | Star rating | `props: { max }` |
| `hidden` | Hidden input | No wrapper/label rendered |

---

### Validation rules

```ts
type ValidationRule =
  | { rule: 'required';   message?: string }
  | { rule: 'email';      message?: string }
  | { rule: 'url';        message?: string }
  | { rule: 'min';        value: number; message?: string }
  | { rule: 'max';        value: number; message?: string }
  | { rule: 'minLength';  value: number; message?: string }
  | { rule: 'maxLength';  value: number; message?: string }
  | { rule: 'pattern';    value: string; message?: string }
```

Rules run top-to-bottom; first failure wins.
Validation fires on blur by default, switches to onChange after first submit.

---

### `useForm` (headless)

Full form state without any rendered UI.

```ts
const {
  values,       // current field values
  errors,       // fieldId → error message
  touched,      // fieldId → boolean
  isSubmitting,
  isSubmitted,
  isValid,
  setValue,     // (fieldId, value) => void
  setTouched,   // (fieldId) => void
  handleChange, // (fieldId) => (value) => void  — attach to onChange
  handleBlur,   // (fieldId) => () => void        — attach to onBlur
  handleSubmit, // (e?) => Promise<void>
  reset,        // (newValues?) => void
} = useForm({ fieldConfigMap, defaultValues, onSubmit });
```

---

### Custom fields

Register a component before mounting any form:

```tsx
import { FieldRegistry } from '@your-org/react-form-builder';
import type { FieldRendererProps } from '@your-org/react-form-builder';

function PhoneField({ config, value, onChange, onBlur }: FieldRendererProps) {
  return (
    <input
      id={`fbr-${config.id}`}
      type="tel"
      value={value as string ?? ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}

FieldRegistry.register('phone', PhoneField);
```

Then in your field config:

```ts
{
  id: 'phone',
  type: 'text',          // fallback type (used for validation, ignored by renderer)
  customType: 'phone',   // overrides the resolved component
  name: 'phone',
  label: 'Phone number',
}
```

---

## Theming

Override CSS custom properties on any ancestor:

```css
.my-form-container {
  --fbr-color-input-border-focus: #10b981;   /* green focus ring */
  --fbr-radius-md: 4px;                      /* sharper corners */
  --fbr-font-family: 'Inter', sans-serif;
}
```

Full token list: `src/theme/form.css`.

---

## Extendibility roadmap

The architecture is intentionally split so these can be added without touching core:

- **Drag-and-drop builder** — `BuilderCanvas` wraps `FormRenderer`; layout becomes mutable state
- **Conditional logic** — `show/hide/require` rules on `SectionLayout` and `FieldConfig`
- **Zod/Yup adapter** — `ValidationEngine` has a pluggable adapter slot
- **Async validators** — `FieldRegistry` can store async validators alongside components
- **Repeater / Group fields** — `FormRenderer` dispatches to layout-aware handlers for these types
- **Multi-page / wizard** — `FormLayout.sections` can be paged using a `FormWizard` wrapper
