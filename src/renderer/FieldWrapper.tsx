import React from 'react';

interface FieldWrapperProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({
  id,
  label,
  hint,
  error,
  touched,
  required,
  children,
}: FieldWrapperProps) {
  const showError = touched && error;

  return (
    <div className="fbr-field-wrapper" data-has-error={showError ? 'true' : undefined}>
      <label className="fbr-label" htmlFor={id}>
        {label}
        {required && (
          <span className="fbr-required" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>

      {children}

      {hint && !showError && (
        <span className="fbr-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}

      {showError && (
        <span className="fbr-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
