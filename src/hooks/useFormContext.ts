import { createContext, useContext } from 'react';
import type { UseFormReturn } from '../hooks/useForm';

export const FormContext = createContext<UseFormReturn | null>(null);

export function useFormContext(): UseFormReturn {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used inside a <Form> component');
  }
  return ctx;
}
