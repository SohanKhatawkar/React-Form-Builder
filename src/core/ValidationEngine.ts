import type { FieldConfig, ValidationRule, FormValues } from '../schema/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+\..+/;

function runRule(rule: ValidationRule, value: unknown): string | null {
  // Coerce for string-length checks
  const str = value == null ? '' : String(value);
  const num = Number(value);

  switch (rule.rule) {
    case 'required': {
      const empty =
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);
      return empty ? (rule.message ?? 'This field is required') : null;
    }
    case 'email':
      return str && !EMAIL_RE.test(str)
        ? (rule.message ?? 'Enter a valid email address')
        : null;
    case 'url':
      return str && !URL_RE.test(str)
        ? (rule.message ?? 'Enter a valid URL')
        : null;
    case 'min':
      return str && num < Number(rule.value)
        ? (rule.message ?? `Minimum value is ${rule.value}`)
        : null;
    case 'max':
      return str && num > Number(rule.value)
        ? (rule.message ?? `Maximum value is ${rule.value}`)
        : null;
    case 'minLength':
      return str && str.length < Number(rule.value)
        ? (rule.message ?? `Must be at least ${rule.value} characters`)
        : null;
    case 'maxLength':
      return str.length > Number(rule.value)
        ? (rule.message ?? `Must be ${rule.value} characters or fewer`)
        : null;
    case 'pattern': {
      const re = new RegExp(String(rule.value));
      return str && !re.test(str)
        ? (rule.message ?? 'Invalid format')
        : null;
    }
    default:
      return null;
  }
}

/**
 * Validate a single field value against its config rules.
 * Returns the first failing message, or null if valid.
 */
export function validateField(config: FieldConfig, value: unknown): string | null {
  if (!config.validation?.length) return null;
  for (const rule of config.validation) {
    const msg = runRule(rule, value);
    if (msg) return msg;
  }
  return null;
}

/**
 * Validate all fields in a form.
 * Returns a map of fieldId → error message (only failing fields included).
 */
export function validateForm(
  configs: FieldConfig[],
  values: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const config of configs) {
    const msg = validateField(config, values[config.id]);
    if (msg) errors[config.id] = msg;
  }
  return errors;
}
