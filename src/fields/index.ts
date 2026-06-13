import { FieldRegistry } from '../core/FieldRegistry';
import {
  TextField,
  NumberField,
  TextareaField,
  SelectField,
  MultiSelectField,
  RadioField,
  CheckboxField,
  ToggleField,
  DateField,
  TimeField,
  FileField,
  SliderField,
  RatingField,
  HiddenField,
} from './BaseFields';

// Register every built-in type.
// The key here is the string used in FieldConfig.type (or FieldConfig.customType).
FieldRegistry.register('text', TextField);
FieldRegistry.register('email', TextField);      // same component, type attr differs
FieldRegistry.register('password', TextField);   // same component, type attr differs
FieldRegistry.register('number', NumberField);
FieldRegistry.register('textarea', TextareaField);
FieldRegistry.register('select', SelectField);
FieldRegistry.register('multiselect', MultiSelectField);
FieldRegistry.register('radio', RadioField);
FieldRegistry.register('checkbox', CheckboxField);
FieldRegistry.register('toggle', ToggleField);
FieldRegistry.register('date', DateField);
FieldRegistry.register('time', TimeField);
FieldRegistry.register('file', FileField);
FieldRegistry.register('slider', SliderField);
FieldRegistry.register('rating', RatingField);
FieldRegistry.register('hidden', HiddenField);

// 'group' and 'repeater' are layout-level concerns wired separately
// in FormRenderer, not the FieldDispatcher. Placeholders for future:
// FieldRegistry.register('group', GroupField);
// FieldRegistry.register('repeater', RepeaterField);

export { FieldRegistry };
