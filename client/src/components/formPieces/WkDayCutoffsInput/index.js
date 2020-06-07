import React from 'react';
import { changeHandlerFactoryForChildrenFactory } from '../../utilities';
import getStyle from './style';
import CollapsableSection from '../CollapsableSection';
import RadioInput from '../RadioInput';
import SelectInput from '../SelectInput';

function WkDayCutoffsInput ({
  propName,
  value,
  isActive,
  hasProblem,
  problems,
  changeHandlerFactory,
  formId,
  topLevelFieldLabelRatio,
  radioUseDefaultCutoffsTrueRef,
  radioUseDefaultCutoffsFalseRef,
  contentToggle
}) {

  const { useDefaults, weekBegins, dayCutoff } = value;

  const reportChange = changeHandlerFactory(propName, false);

  const changeHandlerFactoryForChildren = changeHandlerFactoryForChildrenFactory(
    function(childPropName, childPropValue) {
      let _value = { ...value };
      _value[childPropName] = childPropValue;
      reportChange(_value);
    }
  );

  const style = getStyle();

  return (
    <CollapsableSection
      label="Week and Day Cutoffs"
      outsideContent={
        <RadioInput
          propName="useDefaults"
          sectionName={propName}
          value={useDefaults}
          label="Customize?"
          options={[
            {
              value: false,
              label: 'Yes, adjust cutoffs',
              ref: radioUseDefaultCutoffsFalseRef
            }, {
              value: true,
              label: 'No, use standard values',
              ref: radioUseDefaultCutoffsTrueRef
            }
          ]}
          changeHandlerFactory={changeHandlerFactoryForChildren}
          isInline
          hasProblem={problems && problems.useDefaults}
          fieldToLabelRatio={topLevelFieldLabelRatio}
          {...{ isActive }}
          fieldStyle={style.useDefaultsInputField}
        />
      }
      {...{ contentToggle }}
    >
      <div>
        <h1>test</h1>
      </div>
    </CollapsableSection>
  );
}

export default WkDayCutoffsInput;