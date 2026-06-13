import React from 'react';
import type { FormLayout, FieldConfigMap, FormValues } from './schema/types';
import { useForm } from './hooks/useForm';
import { FormContext } from './hooks/useFormContext';
import { FormRenderer } from './renderer/FormRenderer';

export interface FormProps {
  /** Describes section/row/field-ID structure */
  layout: FormLayout;
  /** Maps each field ID to its full configuration */
  fieldConfigMap: FieldConfigMap;
  /** Pre-fill values; keyed by field id */
  defaultValues?: FormValues;
  /** Called after validation passes */
  onSubmit?: (values: FormValues) => void | Promise<void>;
  /** Called on every value change */
  onChange?: (values: FormValues) => void;
  /** Re-validate on every keystroke (default: only on blur / after first submit) */
  validateOnChange?: boolean;
  /** Custom submit button / footer content */
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * <Form> is the single public entry point.
 *
 * Usage:
 * ```tsx
 * <Form
 *   layout={myLayout}
 *   fieldConfigMap={myFieldConfig}
 *   defaultValues={{ email: 'a@b.com' }}
 *   onSubmit={(values) => console.log(values)}
 * >
 *   <button type="submit">Submit</button>
 * </Form>
 * ```
 */
export function Form({
  layout,
  fieldConfigMap,
  defaultValues,
  onSubmit,
  onChange,
  validateOnChange,
  children,
  className,
  id,
}: FormProps) {
  const form = useForm({ fieldConfigMap, defaultValues, onSubmit, validateOnChange });

  // Notify parent of value changes
  const prevValues = React.useRef(form.values);
  React.useEffect(() => {
    if (onChange && form.values !== prevValues.current) {
      prevValues.current = form.values;
      onChange(form.values);
    }
  }, [form.values, onChange]);

  return (
    <FormContext.Provider value={form}>
      <form
        id={id}
        className={['fbr-form', className].filter(Boolean).join(' ')}
        onSubmit={form.handleSubmit}
        noValidate
      >
        <FormRenderer layout={layout} fieldConfigMap={fieldConfigMap} />
        {children}
      </form>
    </FormContext.Provider>
  );
}
