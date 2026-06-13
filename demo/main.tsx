import React from 'react';
import { createRoot } from 'react-dom/client';
import { Form } from '../src/Form';
import { FieldRegistry } from '../src/core/FieldRegistry';
import '../src/theme/form.css';
import type { FormLayout, FieldConfigMap, FormValues } from '../src/schema/types';

const layout: FormLayout = {
  sections: [
    {
      id: 'personal',
      title: 'Personal Details',
      description: 'Tell us a bit about yourself.',
      rows: [
        ['firstName', 'lastName'],
        ['email'],
        ['gender'],
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
      ],
    },
  ],
};

const fieldConfig: FieldConfigMap = {
  firstName: {
    id: 'firstName', type: 'text', name: 'firstName', label: 'First name',
    placeholder: 'Jane', validation: [{ rule: 'required' }, { rule: 'minLength', value: 2 }],
  },
  lastName: {
    id: 'lastName', type: 'text', name: 'lastName', label: 'Last name',
    placeholder: 'Smith', validation: [{ rule: 'required' }],
  },
  email: {
    id: 'email', type: 'email', name: 'email', label: 'Email address',
    placeholder: 'jane@example.com', hint: "We'll never share your email.",
    validation: [{ rule: 'required' }, { rule: 'email' }],
  },
  gender: {
    id: 'gender', type: 'select', name: 'gender', label: 'Gender',
    placeholder: 'Select…',
    options: [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male' },
      { label: 'Non-binary', value: 'nonbinary' },
      { label: 'Prefer not to say', value: 'unspecified' },
    ],
  },
  username: {
    id: 'username', type: 'text', name: 'username', label: 'Username',
    hint: 'Letters, numbers, underscores only.',
    validation: [
      { rule: 'required' },
      { rule: 'minLength', value: 3 },
      { rule: 'pattern', value: '^[a-zA-Z0-9_]+$', message: 'Only letters, numbers, and underscores' },
    ],
  },
  password: {
    id: 'password', type: 'password', name: 'password', label: 'Password',
    validation: [{ rule: 'required' }, { rule: 'minLength', value: 8 }],
  },
  confirmPassword: {
    id: 'confirmPassword', type: 'password', name: 'confirmPassword', label: 'Confirm password',
    validation: [{ rule: 'required' }],
  },
  agreeToTerms: {
    id: 'agreeToTerms', type: 'checkbox', name: 'agreeToTerms', label: 'Terms',
    placeholder: 'I agree to the terms and conditions',
    validation: [{ rule: 'required', message: 'You must accept the terms' }],
  },
  newsletter: {
    id: 'newsletter', type: 'toggle', name: 'newsletter', label: 'Email newsletter',
    defaultValue: false,
  },
  favouriteColor: {
    id: 'favouriteColor', type: 'radio', name: 'favouriteColor', label: 'Favourite colour',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
  },
  experience: {
    id: 'experience', type: 'slider', name: 'experience', label: 'Years of experience',
    defaultValue: 0, props: { min: 0, max: 20, step: 1 },
  },
};

function App() {
  const [submitted, setSubmitted] = React.useState<FormValues | null>(null);

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>React Form Builder Demo</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>Layout-driven form with built-in validation.</p>

      <Form
        layout={layout}
        fieldConfigMap={fieldConfig}
        defaultValues={{ newsletter: true }}
        onSubmit={async (values) => setSubmitted(values)}
      >
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button type="submit" style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
            Create account
          </button>
          <button type="reset" style={{ padding: '10px 24px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}>
            Clear
          </button>
        </div>
      </Form>

      {submitted && (
        <pre style={{ marginTop: 32, padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 13 }}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
