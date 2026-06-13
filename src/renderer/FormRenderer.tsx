import React from 'react';
import type { FormLayout, FieldConfigMap } from '../schema/types';
import { FieldDispatcher } from './FieldDispatcher';
import { useFormContext } from '../hooks/useFormContext';

interface FormRendererProps {
  layout: FormLayout;
  fieldConfigMap: FieldConfigMap;
}

export function FormRenderer({ layout, fieldConfigMap }: FormRendererProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormContext();

  return (
    <div className="fbr-form-body">
      {layout.sections.map((section) => (
        <section key={section.id} className="fbr-section" aria-labelledby={`fbr-section-${section.id}`}>
          {(section.title || section.description) && (
            <div className="fbr-section-header">
              {section.title && (
                <h3 className="fbr-section-title" id={`fbr-section-${section.id}`}>
                  {section.title}
                </h3>
              )}
              {section.description && (
                <p className="fbr-section-description">{section.description}</p>
              )}
            </div>
          )}

          <div className="fbr-section-rows">
            {section.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="fbr-row">
                {row.map((fieldId) => {
                  const config = fieldConfigMap[fieldId];

                  if (!config) {
                    if (process.env.NODE_ENV !== 'production') {
                      console.warn(
                        `[react-form-builder] Layout references field id="${fieldId}" ` +
                          `but no config was found in fieldConfigMap.`
                      );
                    }
                    return null;
                  }

                  const colSpan = config.colSpan;
                  const style = colSpan
                    ? ({ '--fbr-col-span': colSpan } as React.CSSProperties)
                    : undefined;

                  return (
                    <div
                      key={fieldId}
                      className="fbr-col"
                      style={style}
                      data-col-span={colSpan}
                    >
                      <FieldDispatcher
                        config={config}
                        value={values[fieldId]}
                        error={errors[fieldId]}
                        touched={touched[fieldId]}
                        onChange={handleChange(fieldId)}
                        onBlur={handleBlur(fieldId)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
