import React from 'react';
import { FieldRegistry } from '../core/FieldRegistry';
import { FieldWrapper } from './FieldWrapper';
import type { FieldConfig } from '../schema/types';
import type { FieldRendererProps } from './types';

interface FieldDispatcherProps {
  config: FieldConfig;
  value: unknown;
  error?: string;
  touched?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

export function FieldDispatcher({
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
}: FieldDispatcherProps) {
  // customType takes priority; falls back to the built-in type string
  const lookupKey = config.customType ?? config.type;
  const FieldComponent = FieldRegistry.resolve(lookupKey);

  if (!FieldComponent) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[react-form-builder] No component registered for field type "${lookupKey}". ` +
          `Field id="${config.id}" will be skipped.`
      );
    }
    return null;
  }

  // Hidden fields skip the wrapper entirely
  if (config.type === 'hidden') {
    const props: FieldRendererProps = { config, value, error, touched, onChange, onBlur };
    return <FieldComponent {...props} />;
  }

  const isRequired = config.validation?.some((r) => r.rule === 'required') ?? false;
  const fieldId = `fbr-${config.id}`;

  const props: FieldRendererProps = {
    config,
    value,
    error,
    touched,
    disabled: config.disabled,
    onChange,
    onBlur,
  };

  return (
    <FieldWrapper
      id={fieldId}
      label={config.label}
      hint={config.hint}
      error={error}
      touched={touched}
      required={isRequired}
    >
      <FieldComponent {...props} />
    </FieldWrapper>
  );
}
