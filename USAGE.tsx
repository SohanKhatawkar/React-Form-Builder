/**
 * USAGE EXAMPLE
 * Demonstrates the layout-driven form pattern:
 *   layout     = where fields go (sections → rows → field IDs)
 *   fieldConfig = what each field is (type, label, validation, options…)
 *   <Form>     = receives both at runtime, renders the form
 */

import React from 'react';
import {
  Form,
  FieldRegistry,
} from '@your-org/react-form-builder';
import '@your-org/react-form-builder/dist/form.css';

import type {
  FormLayout,
  FieldConfigMap,
  FormValues,
  FieldRendererProps,
} from '@your-org/react-form-builder';

// ─── 1. Define the layout ─────────────────────────────────────────────────────
//
// Layout only knows IDs. It's completely decoupled from field internals.
// You can swap fieldConfig without touching the layout, and vice versa.

const layout: FormLayout = {
  sections: [
    {
      id: 'personal',
      title: 'Personal details',
      description: 'Tell us a bit about yourself.',
      rows: [
        ['firstName', 'lastName'],   // two-column row
        ['email'],                   // full-width row
        ['dob', 'gender'],           // two-column row
      ],
    },
    {
      id: 'account',
      title: 'Account',
      rows: [
        ['username'],
        ['password', 'confirmPassword'],
        ['agreeToTerms'],
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      rows: [
        ['newsletter'],
        ['favouriteColor'],
        ['experience'],
        ['rating'],
      ],
    },
  ],
};

// ─── 2. Define field config ───────────────────────────────────────────────────
//
// Each key must match an ID used in the layout.
// Fields not in the layout are ignored at render time.

const fieldConfig: FieldConfigMap = {
  firstName: {
    id: 'firstName',
    type: 'text',
    name: 'firstName',
    label: 'First name',
    placeholder: 'Jane',
    validation: [{ rule: 'required' }, { rule: 'minLength', value: 2 }],
  },
  lastName: {
    id: 'lastName',
    type: 'text',
    name: 'lastName',
    label: 'Last name',
    placeholder: 'Smith',
    validation: [{ rule: 'required' }],
  },
  email: {
    id: 'email',
    type: 'email',
    name: 'email',
    label: 'Email address',
    placeholder: 'jane@example.com',
    hint: "We'll never share your email.",
    validation: [{ rule: 'required' }, { rule: 'email' }],
  },
  dob: {
    id: 'dob',
    type: 'date',
    name: 'dob',
    label: 'Date of birth',
    props: { max: new Date().toISOString().split('T')[0] },
  },
  gender: {
    id: 'gender',
    type: 'select',
    name: 'gender',
    label: 'Gender',
    placeholder: 'Prefer not to say',
    options: [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male' },
      { label: 'Non-binary', value: 'nonbinary' },
      { label: 'Prefer not to say', value: 'unspecified' },
    ],
  },
  username: {
    id: 'username',
    type: 'text',
    name: 'username',
    label: 'Username',
    hint: 'Letters, numbers, underscores only.',
    validation: [
      { rule: 'required' },
      { rule: 'minLength', value: 3 },
      { rule: 'pattern', value: '^[a-zA-Z0-9_]+$', message: 'Only letters, numbers, and underscores' },
    ],
  },
  password: {
    id: 'password',
    type: 'password',
    name: 'password',
    label: 'Password',
    validation: [{ rule: 'required' }, { rule: 'minLength', value: 8 }],
  },
  confirmPassword: {
    id: 'confirmPassword',
    type: 'password',
    name: 'confirmPassword',
    label: 'Confirm password',
    validation: [{ rule: 'required' }],
  },
  agreeToTerms: {
    id: 'agreeToTerms',
    type: 'checkbox',
    name: 'agreeToTerms',
    label: 'Terms',
    placeholder: 'I agree to the terms and conditions',
    validation: [{ rule: 'required', message: 'You must accept the terms' }],
  },
  newsletter: {
    id: 'newsletter',
    type: 'toggle',
    name: 'newsletter',
    label: 'Email newsletter',
    defaultValue: false,
  },
  favouriteColor: {
    id: 'favouriteColor',
    type: 'radio',
    name: 'favouriteColor',
    label: 'Favourite colour',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
  },
  experience: {
    id: 'experience',
    type: 'slider',
    name: 'experience',
    label: 'Years of experience',
    defaultValue: 0,
    props: { min: 0, max: 20, step: 1 },
  },
  rating: {
    id: 'rating',
    type: 'rating',
    name: 'rating',
    label: 'How would you rate us?',
    props: { max: 5 },
  },
};

// ─── 3. Register a custom field (optional) ────────────────────────────────────
//
// Any type string works. Set customType: 'color-picker' in FieldConfig
// and FieldRegistry.register('color-picker', MyColorPicker) before mounting.

function ColorPickerField({ config, value, onChange }: FieldRendererProps) {
  return (
    <input
      id={`fbr-${config.id}`}
      type="color"
      value={value as string || '#6366f1'}
      style={{ width: 48, height: 40, padding: 2, border: '1px solid #d1d5db', borderRadius: 8 }}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

FieldRegistry.register('color-picker', ColorPickerField);

// ─── 4. Mount the form ────────────────────────────────────────────────────────

export function RegistrationForm() {
  const handleSubmit = async (values: FormValues) => {
    console.log('Submitted:', values);
    // await api.registerUser(values);
  };

  return (
    <Form
      layout={layout}
      fieldConfigMap={fieldConfig}
      defaultValues={{ newsletter: true }}
      onSubmit={handleSubmit}
      onChange={(values) => console.log('Live values:', values)}
    >
      {/* Anything inside <Form> renders below the fields */}
      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button type="submit">Create account</button>
        <button type="reset">Clear</button>
      </div>
    </Form>
  );
}

// ─── 5. Headless usage (bring your own UI) ────────────────────────────────────
//
// useForm gives you all the state without any rendered output.

import { useForm } from '@your-org/react-form-builder';

export function HeadlessExample() {
  const form = useForm({
    fieldConfigMap: fieldConfig,
    onSubmit: async (values) => console.log(values),
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        value={form.values.email as string ?? ''}
        onChange={(e) => form.setValue('email', e.target.value)}
        onBlur={() => form.setTouched('email')}
      />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Saving…' : 'Submit'}
      </button>
    </form>
  );
}
