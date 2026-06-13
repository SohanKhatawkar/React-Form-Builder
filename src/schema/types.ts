// ─── Layout types ────────────────────────────────────────────────────────────
// Layout only knows about IDs. It knows nothing about field internals.

export interface FormLayout {
  sections: SectionLayout[];
}

export interface SectionLayout {
  id: string;
  title?: string;
  description?: string;
  rows: RowLayout[];
  /** For future: collapsible, conditional section visibility */
  _meta?: Record<string, unknown>;
}

/**
 * A row is an array of field IDs.
 * Single field:  ['email']
 * Two-column:   ['firstName', 'lastName']
 * Three-column: ['city', 'state', 'zip']
 * Width is distributed equally unless fieldConfig[id].colSpan is set.
 */
export type RowLayout = string[];

// ─── Field config types ───────────────────────────────────────────────────────
// Field config knows everything about a field except where it sits in the form.

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'date'
  | 'time'
  | 'file'
  | 'slider'
  | 'rating'
  | 'hidden'
  | 'group'
  | 'repeater';

export interface SelectOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

export interface ValidationRule {
  rule: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url';
  value?: number | string;
  message?: string;
}

export interface FieldConfig {
  /** Must match the ID used in layout */
  id: string;
  type: FieldType;
  /** The key used in submitted form values */
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  defaultValue?: unknown;
  disabled?: boolean;
  readOnly?: boolean;
  /** 1–12 column span (out of 12). Overrides equal-split row layout. */
  colSpan?: number;
  validation?: ValidationRule[];
  options?: SelectOption[];            // select, multiselect, radio
  /** Field-type-specific props (min/max for number, accept for file, etc.) */
  props?: Record<string, unknown>;
  /**
   * Extendibility hook: custom renderer key registered via FieldRegistry.
   * When set, FormRenderer looks up this key instead of the built-in `type`.
   */
  customType?: string;
}

/** The complete map passed to <Form> — keyed by field id */
export type FieldConfigMap = Record<string, FieldConfig>;

// ─── Form-level types ─────────────────────────────────────────────────────────

export type FormValues = Record<string, unknown>;

export interface FormError {
  fieldId: string;
  message: string;
}

export type FormErrors = Record<string, string>;   // fieldId → message
export type FormTouched = Record<string, boolean>;  // fieldId → touched
