import { useReducer, useCallback, useMemo } from 'react';
import type { FieldConfig, FieldConfigMap, FormValues, FormErrors, FormTouched } from '../schema/types';
import { validateField, validateForm } from '../core/ValidationEngine';

// ─── State ────────────────────────────────────────────────────────────────────

interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_VALUE'; fieldId: string; value: unknown }
  | { type: 'SET_TOUCHED'; fieldId: string }
  | { type: 'SET_ERROR'; fieldId: string; message: string | null }
  | { type: 'SET_ERRORS'; errors: FormErrors }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_SUBMITTED' }
  | { type: 'RESET'; values: FormValues };

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.fieldId]: action.value },
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.fieldId]: true },
      };
    case 'SET_ERROR': {
      const errors = { ...state.errors };
      if (action.message) {
        errors[action.fieldId] = action.message;
      } else {
        delete errors[action.fieldId];
      }
      return { ...state, errors };
    }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: true, isSubmitting: false };
    case 'RESET':
      return {
        values: action.values,
        errors: {},
        touched: {},
        isSubmitting: false,
        isSubmitted: false,
      };
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseFormOptions {
  fieldConfigMap: FieldConfigMap;
  defaultValues?: FormValues;
  onSubmit?: (values: FormValues) => void | Promise<void>;
  /** validate on every change after first submit; otherwise only on blur */
  validateOnChange?: boolean;
}

export interface UseFormReturn {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  getValue: (fieldId: string) => unknown;
  setValue: (fieldId: string, value: unknown) => void;
  setTouched: (fieldId: string) => void;
  handleChange: (fieldId: string) => (value: unknown) => void;
  handleBlur: (fieldId: string) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: (newValues?: FormValues) => void;
}

function buildInitialValues(
  fieldConfigMap: FieldConfigMap,
  defaultValues?: FormValues
): FormValues {
  const values: FormValues = {};
  for (const [id, config] of Object.entries(fieldConfigMap)) {
    values[id] = defaultValues?.[id] ?? config.defaultValue ?? '';
  }
  return values;
}

export function useForm({
  fieldConfigMap,
  defaultValues,
  onSubmit,
  validateOnChange = false,
}: UseFormOptions): UseFormReturn {
  const initialValues = useMemo(
    () => buildInitialValues(fieldConfigMap, defaultValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [state, dispatch] = useReducer(reducer, {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isSubmitted: false,
  });

  const configs = useMemo(() => Object.values(fieldConfigMap), [fieldConfigMap]);

  // Revalidate a single field and push the result into state
  const revalidateField = useCallback(
    (fieldId: string, value: unknown) => {
      const config = fieldConfigMap[fieldId];
      if (!config) return;
      const msg = validateField(config, value);
      dispatch({ type: 'SET_ERROR', fieldId, message: msg });
    },
    [fieldConfigMap]
  );

  const setValue = useCallback(
    (fieldId: string, value: unknown) => {
      dispatch({ type: 'SET_VALUE', fieldId, value });
      // After first submit, validate eagerly on every change
      if (state.isSubmitted || validateOnChange) {
        revalidateField(fieldId, value);
      }
    },
    [state.isSubmitted, validateOnChange, revalidateField]
  );

  const setTouched = useCallback((fieldId: string) => {
    dispatch({ type: 'SET_TOUCHED', fieldId });
  }, []);

  const handleChange = useCallback(
    (fieldId: string) => (value: unknown) => setValue(fieldId, value),
    [setValue]
  );

  const handleBlur = useCallback(
    (fieldId: string) => () => {
      setTouched(fieldId);
      revalidateField(fieldId, state.values[fieldId]);
    },
    [setTouched, revalidateField, state.values]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      dispatch({ type: 'SET_SUBMITTING', value: true });

      const errors = validateForm(configs, state.values);
      dispatch({ type: 'SET_ERRORS', errors });
      // Mark all fields as touched so errors are shown
      const allTouched: FormTouched = {};
      for (const c of configs) allTouched[c.id] = true;
      dispatch({ type: 'RESET', values: state.values });
      // Re-apply touched + errors after reset (reset clears them)
      for (const c of configs) dispatch({ type: 'SET_TOUCHED', fieldId: c.id });
      dispatch({ type: 'SET_ERRORS', errors });

      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_SUBMITTING', value: false });
        return;
      }

      try {
        await onSubmit?.(state.values);
      } finally {
        dispatch({ type: 'SET_SUBMITTED' });
      }
    },
    [configs, state.values, onSubmit]
  );

  const reset = useCallback(
    (newValues?: FormValues) => {
      dispatch({
        type: 'RESET',
        values: buildInitialValues(fieldConfigMap, newValues ?? defaultValues),
      });
    },
    [fieldConfigMap, defaultValues]
  );

  const getValue = useCallback(
    (fieldId: string) => state.values[fieldId],
    [state.values]
  );

  const isValid = Object.keys(state.errors).length === 0;

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isSubmitted: state.isSubmitted,
    isValid,
    getValue,
    setValue,
    setTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}
