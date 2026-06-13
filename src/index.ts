// Initialize built-in field registry on import — must be first
import {
  TextField,
  NumberField,
  TextareaField,
  SelectField,
  MultiSelectField,
  RadioField,
  CheckboxField,
  ToggleField,
  DateField,
  TimeField,
  FileField,
  SliderField,
  RatingField,
  HiddenField,
} from './fields/BaseFields';
import { FieldRegistry as _FR } from './core/FieldRegistry';

_FR.register('text', TextField);
_FR.register('email', TextField);
_FR.register('password', TextField);
_FR.register('number', NumberField);
_FR.register('textarea', TextareaField);
_FR.register('select', SelectField);
_FR.register('multiselect', MultiSelectField);
_FR.register('radio', RadioField);
_FR.register('checkbox', CheckboxField);
_FR.register('toggle', ToggleField);
_FR.register('date', DateField);
_FR.register('time', TimeField);
_FR.register('file', FileField);
_FR.register('slider', SliderField);
_FR.register('rating', RatingField);
_FR.register('hidden', HiddenField);

// ─── Main component ───────────────────────────────────────────────────────────
export { Form } from './Form';
export type { FormProps } from './Form';

// ─── Sub-components (for advanced composition) ────────────────────────────────
export { FormRenderer } from './renderer/FormRenderer';
export { FieldDispatcher } from './renderer/FieldDispatcher';
export { FieldWrapper } from './renderer/FieldWrapper';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useForm } from './hooks/useForm';
export type { UseFormOptions, UseFormReturn } from './hooks/useForm';
export { useFormContext } from './hooks/useFormContext';

// ─── Schema types (all of them — consumers need these for TS) ─────────────────
export type {
  FormLayout,
  SectionLayout,
  RowLayout,
  FieldConfig,
  FieldConfigMap,
  FieldType,
  SelectOption,
  ValidationRule,
  FormValues,
  FormErrors,
  FormTouched,
} from './schema/types';

// ─── Core engine (for custom integrations) ────────────────────────────────────
export { FieldRegistry } from './core/FieldRegistry';
export { validateField, validateForm } from './core/ValidationEngine';

// ─── Renderer types (needed when writing custom field components) ──────────────
export type { FieldRendererProps } from './renderer/types';

// ─── CSS — consumers import this once in their app entry ──────────────────────
// import '@your-org/react-form-builder/dist/form.css'
// (exported via package.json "exports" field)
