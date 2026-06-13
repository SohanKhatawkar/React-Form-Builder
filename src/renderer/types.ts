import type { FieldConfig } from '../schema/types';

export interface FieldRendererProps {
  config: FieldConfig;
  value: unknown;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}
