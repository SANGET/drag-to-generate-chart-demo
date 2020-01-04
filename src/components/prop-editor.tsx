import React from 'react';
import { FormLayout } from '@deer-ui/core/form-layout';

class ComponentPropsEditor extends React.Component {
  FormRef!: FormLayout

  constructor(props) {
    super(props);
    const {
      selectedComponent,
    } = this.props;
    const {
      runningProps
    } = selectedComponent;
    this.state = {
      innerValue: runningProps
    };
  }

  setinnerValue = (innerValue) => {
    this.setState({
      innerValue
    });
  }

  saveForm = (e) => {
    const {
      selectedComponent
    } = this.props;
    const {
      runningProps
    } = selectedComponent;
    if (e) {
      e.formHelper.changeValues(runningProps);
    }
  }

  render() {
    const {
      selectedComponent, onChangeValue, columns, dataSource
    } = this.props;
    const {
      title, component, type, runningProps
    } = selectedComponent;
    const { innerValue } = this.state;
    const { genEditablePropsConfig } = component;
    // console.log(runningProps)
    // const [innerValue, setinnerValue] = useState(runningProps);
    const formOptions = genEditablePropsConfig(columns, innerValue, dataSource);
    return (
      <div className="chart-editor">
        <FormLayout
          key={type}
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
          ref={this.saveForm}
          layout="vertical"
          onChange={(values, ref, val) => {
            // onChangeValue(values);
            this.setinnerValue(values);
          }}
        />
      </div>
    );
  }
}

export default ComponentPropsEditor;
