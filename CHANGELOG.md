# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-06-12

### Added
- `<Form>` component — receives `layout` and `fieldConfigMap` as props
- `FormLayout` type — sections → rows → field IDs
- `FieldConfigMap` type — field ID to full field definition
- `useForm` headless hook — values, errors, touched, submit handling
- `useFormContext` — access form state from any child component
- `FieldRegistry` — register custom field components by type string
- Built-in field types: text, email, password, number, textarea, select,
  multiselect, radio, checkbox, toggle, date, time, file, slider, rating, hidden
- Built-in validation rules: required, email, url, min, max, minLength, maxLength, pattern
- CSS custom property theming system (`--fbr-*` tokens)
- Dark mode support out of the box
- Full TypeScript types exported from package root
