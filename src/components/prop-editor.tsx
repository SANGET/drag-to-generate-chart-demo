import React from 'react';
import { FormLayout } from '@deer-ui/core/form-layout';

const ComponentPropsEditor = ({
  selectedComponent, onChangeValue, columns
}) => {
  if (!selectedComponent) return null;
  const {
    title, component, type, runningProps
  } = selectedComponent;
  const { genEditablePropsConfig } = component;
  return (
    <div className="chart-editor">
      <FormLayout
        formOptions={['Props editor', ...genEditablePropsConfig(columns)]}
        formBtns={[
          {
            action: (formRef) => {
              const checkRes = formRef.checkForm();
              // console.log(checkRes);
              onChangeValue(formRef.value);
            },
            text: 'Update UI'
          }
        ]}
        ref={(e) => {
          if (e) {
            e.formHelper.changeValues(runningProps, true);
          }
        }}
        layout="vertical"
        // onChange={(values, ref, val) => {
        // }}
      />
    </div>
  );
};

export default ComponentPropsEditor;
