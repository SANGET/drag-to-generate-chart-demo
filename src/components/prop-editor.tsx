import React, { useState } from 'react';
import { FormLayout } from '@deer-ui/core/form-layout';

const ComponentPropsEditor = ({
  selectedComponent, onChangeValue, columns, dataSource
}) => {
  const {
    title, component, type, runningProps
  } = selectedComponent;
  const { genEditablePropsConfig } = component;
  // console.log(runningProps)
  const [innerValue, setinnerValue] = useState(runningProps);
  const formOptions = genEditablePropsConfig(columns, innerValue, dataSource);
  return (
    <div className="chart-editor">
      <FormLayout
        formOptions={[
          'Props editor',
          ...formOptions
        ]}
        formBtns={[
          {
            action: (formRef) => {
              // const checkRes = formRef.checkForm();
              // console.log(checkRes);
              onChangeValue(formRef.value);
            },
            preCheck: true,
            text: 'Update UI'
          }
        ]}
        // ref={(e) => {
        //   if (e) {
        //     console.log('asd')
        //     e.formHelper.changeValues(runningProps, true);
        //   }
        // }}
        layout="vertical"
        onChange={(values, ref, val) => {
          // onChangeValue(values);
          setinnerValue(values);
        }}
      />
    </div>
  );
};

export default ComponentPropsEditor;
