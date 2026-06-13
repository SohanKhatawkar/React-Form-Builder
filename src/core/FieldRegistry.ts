import type { ComponentType } from 'react';
import type { FieldRendererProps } from '../renderer/types';

type FieldComponent = ComponentType<FieldRendererProps>;

/**
 * Global registry mapping field type strings → React components.
 *
 * Built-in fields are registered in fields/index.ts.
 * Consumers can call FieldRegistry.register('my-custom-field', MyComponent)
 * before mounting <Form> to extend the system.
 */
class FieldRegistryClass {
  private registry = new Map<string, FieldComponent>();

  register(type: string, component: FieldComponent): void {
    this.registry.set(type, component);
  }

  resolve(type: string): FieldComponent | undefined {
    return this.registry.get(type);
  }

  has(type: string): boolean {
    return this.registry.has(type);
  }

  /** List all registered types — useful for the future builder toolbox */
  types(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const FieldRegistry = new FieldRegistryClass();
