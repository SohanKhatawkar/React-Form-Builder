import React from 'react';
import type { FieldRendererProps } from '../renderer/types';

// ─── Shared helper ────────────────────────────────────────────────────────────

function fieldId(config: FieldRendererProps['config']) {
  return `fbr-${config.id}`;
}

function ariaProps(config: FieldRendererProps['config'], error?: string) {
  return {
    id: fieldId(config),
    'aria-describedby': [
      error ? `${fieldId(config)}-error` : null,
      config.hint ? `${fieldId(config)}-hint` : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined,
    'aria-invalid': error ? ('true' as const) : undefined,
  };
}

// ─── TextField ────────────────────────────────────────────────────────────────

export function TextField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  return (
    <input
      {...ariaProps(config, touched ? error : undefined)}
      type={config.type === 'password' ? 'password' : config.type === 'email' ? 'email' : 'text'}
      name={config.name}
      value={value as string ?? ''}
      placeholder={config.placeholder}
      disabled={disabled ?? config.disabled}
      readOnly={config.readOnly}
      className="fbr-input"
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}

// ─── NumberField ──────────────────────────────────────────────────────────────

export function NumberField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  const { min, max, step } = (config.props ?? {}) as Record<string, number>;
  return (
    <input
      {...ariaProps(config, touched ? error : undefined)}
      type="number"
      name={config.name}
      value={value as number ?? ''}
      placeholder={config.placeholder}
      disabled={disabled ?? config.disabled}
      readOnly={config.readOnly}
      min={min}
      max={max}
      step={step}
      className="fbr-input"
      onChange={(e) => onChange(e.target.valueAsNumber)}
      onBlur={onBlur}
    />
  );
}

// ─── TextareaField ────────────────────────────────────────────────────────────

export function TextareaField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  const { rows = 4 } = (config.props ?? {}) as { rows?: number };
  return (
    <textarea
      {...ariaProps(config, touched ? error : undefined)}
      name={config.name}
      value={value as string ?? ''}
      placeholder={config.placeholder}
      disabled={disabled ?? config.disabled}
      readOnly={config.readOnly}
      rows={rows}
      className="fbr-textarea"
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────────

export function SelectField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  return (
    <select
      {...ariaProps(config, touched ? error : undefined)}
      name={config.name}
      value={value as string ?? ''}
      disabled={disabled ?? config.disabled}
      className="fbr-select"
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    >
      <option value="">{config.placeholder ?? 'Select…'}</option>
      {config.options?.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// ─── MultiSelectField ─────────────────────────────────────────────────────────

export function MultiSelectField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  const selected = (value as string[]) ?? [];
  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(next);
  };

  return (
    <div
      {...ariaProps(config, touched ? error : undefined)}
      role="group"
      aria-labelledby={`fbr-${config.id}-label`}
      className="fbr-multiselect"
      onBlur={onBlur}
    >
      {config.options?.map((opt) => {
        const id = `fbr-${config.id}-${opt.value}`;
        const checked = selected.includes(String(opt.value));
        return (
          <label key={String(opt.value)} className="fbr-check-option" htmlFor={id}>
            <input
              id={id}
              type="checkbox"
              value={String(opt.value)}
              checked={checked}
              disabled={disabled ?? config.disabled ?? opt.disabled}
              className="fbr-checkbox-input"
              onChange={() => toggle(String(opt.value))}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

// ─── RadioField ───────────────────────────────────────────────────────────────

export function RadioField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={`fbr-${config.id}-label`}
      className="fbr-radio-group"
      onBlur={onBlur}
    >
      {config.options?.map((opt) => {
        const id = `fbr-${config.id}-${opt.value}`;
        return (
          <label key={String(opt.value)} className="fbr-radio-option" htmlFor={id}>
            <input
              id={id}
              type="radio"
              name={config.name}
              value={String(opt.value)}
              checked={value === String(opt.value)}
              disabled={disabled ?? config.disabled ?? opt.disabled}
              className="fbr-radio-input"
              onChange={() => onChange(String(opt.value))}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

// ─── CheckboxField ────────────────────────────────────────────────────────────
// Single checkbox (boolean). For a group of checkboxes, use MultiSelectField.

export function CheckboxField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  return (
    <label className="fbr-checkbox-label" htmlFor={fieldId(config)}>
      <input
        id={fieldId(config)}
        type="checkbox"
        name={config.name}
        checked={Boolean(value)}
        disabled={disabled ?? config.disabled}
        className="fbr-checkbox-input"
        aria-invalid={touched && error ? 'true' : undefined}
        aria-describedby={touched && error ? `${fieldId(config)}-error` : undefined}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
      />
      <span>{config.placeholder ?? config.label}</span>
    </label>
  );
}

// ─── ToggleField ──────────────────────────────────────────────────────────────

export function ToggleField({ config, value, disabled, onChange, onBlur }: FieldRendererProps) {
  return (
    <button
      id={fieldId(config)}
      type="button"
      role="switch"
      aria-checked={Boolean(value)}
      disabled={disabled ?? config.disabled}
      className={`fbr-toggle ${value ? 'fbr-toggle--on' : ''}`}
      onClick={() => onChange(!value)}
      onBlur={onBlur}
    >
      <span className="fbr-toggle-thumb" />
      <span className="fbr-sr-only">{value ? 'On' : 'Off'}</span>
    </button>
  );
}

// ─── DateField ────────────────────────────────────────────────────────────────

export function DateField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  const { min, max } = (config.props ?? {}) as { min?: string; max?: string };
  return (
    <input
      {...ariaProps(config, touched ? error : undefined)}
      type="date"
      name={config.name}
      value={value as string ?? ''}
      disabled={disabled ?? config.disabled}
      readOnly={config.readOnly}
      min={min}
      max={max}
      className="fbr-input"
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}

// ─── TimeField ────────────────────────────────────────────────────────────────

export function TimeField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  return (
    <input
      {...ariaProps(config, touched ? error : undefined)}
      type="time"
      name={config.name}
      value={value as string ?? ''}
      disabled={disabled ?? config.disabled}
      readOnly={config.readOnly}
      className="fbr-input"
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}

// ─── FileField ────────────────────────────────────────────────────────────────

export function FileField({ config, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  const { accept, multiple } = (config.props ?? {}) as { accept?: string; multiple?: boolean };
  return (
    <input
      {...ariaProps(config, touched ? error : undefined)}
      type="file"
      name={config.name}
      accept={accept}
      multiple={multiple}
      disabled={disabled ?? config.disabled}
      className="fbr-file"
      onChange={(e) => onChange(multiple ? Array.from(e.target.files ?? []) : e.target.files?.[0] ?? null)}
      onBlur={onBlur}
    />
  );
}

// ─── SliderField ──────────────────────────────────────────────────────────────

export function SliderField({ config, value, error, touched, disabled, onChange, onBlur }: FieldRendererProps) {
  const { min = 0, max = 100, step = 1 } = (config.props ?? {}) as Record<string, number>;
  const num = value as number ?? min;
  return (
    <div className="fbr-slider-wrap">
      <input
        {...ariaProps(config, touched ? error : undefined)}
        type="range"
        name={config.name}
        value={num}
        min={min}
        max={max}
        step={step}
        disabled={disabled ?? config.disabled}
        className="fbr-slider"
        onChange={(e) => onChange(e.target.valueAsNumber)}
        onBlur={onBlur}
      />
      <span className="fbr-slider-value" aria-hidden="true">{num}</span>
    </div>
  );
}

// ─── RatingField ──────────────────────────────────────────────────────────────

export function RatingField({ config, value, disabled, onChange, onBlur }: FieldRendererProps) {
  const { max = 5 } = (config.props ?? {}) as { max?: number };
  const rating = value as number ?? 0;
  return (
    <div
      id={fieldId(config)}
      role="radiogroup"
      className="fbr-rating"
      onBlur={onBlur}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          aria-pressed={star <= rating}
          disabled={disabled ?? config.disabled}
          className={`fbr-rating-star ${star <= rating ? 'fbr-rating-star--filled' : ''}`}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── HiddenField ──────────────────────────────────────────────────────────────

export function HiddenField({ config, value }: FieldRendererProps) {
  return (
    <input
      type="hidden"
      name={config.name}
      value={value as string ?? ''}
    />
  );
}
