import React from 'react';
import {
  changeHandlerFactoryForChildrenFactory,
  getWeekdays
} from '../../utilities';
import getStyle from './style';
import CollapsableSection from '../CollapsableSection';
import RadioInput from '../RadioInput';
import SelectInput from '../SelectInput';
import DayCutoffInput from './DayCutoffInput';

const weekDayOptions = (
  getWeekdays()
  .map((dayName, index) => ({ name: dayName, value: index }))
);

function WkDayCutoffsInput ({
  propName,
  value,
  isActive,
  hasProblem,
  problems,
  changeHandlerFactory,
  formId,
  radioUseDefaultCutoffsTrueRef,
  radioUseDefaultCutoffsFalseRef,
  topLevelFieldLabelRatio,
  secondLevelFieldLabelRatio,
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

  const { isExpanded } = contentToggle || {};

  const areInsideInputsActive = isActive && !useDefaults && isExpanded;

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
          helpText="Default values follow standard calendar weeks and days (Sun. - Sat.; 12 AM)."
        />
      }
      {...{ contentToggle }}
    >
      <SelectInput
        propName="weekBegins"
        sectionName={propName}
        value={useDefaults ? 0 : weekBegins}
        options={weekDayOptions}
        changeHandlerFactory={changeHandlerFactoryForChildren}
        label="Week Begins On:"
        placeholder="Select day on which a new work week begins..."
        helpText="Hint: Use the day that begins a new week on your work schedule or a new pay period even if you do not personally work that day."
        hasProblem={problems && problems.weekBegins}
        {...{ formId }}
        isInline
        isActive={areInsideInputsActive}
        fieldToLabelRatio={secondLevelFieldLabelRatio}
        fieldStyle={style.firstInputInSection}
        fieldLabelStyle={style.weekBeginsLabel}
      />
      <DayCutoffInput
        propName="dayCutoff"
        sectionName={propName}
        value={useDefaults ? { hour: 0, minute: 0, is24hr: dayCutoff.is24hr } : dayCutoff}
        changeHandlerFactory={changeHandlerFactoryForChildren}
        hasProblem={problems && problems.dayCutoff}
        {...{ formId }}
        isInline
        isActive={areInsideInputsActive}
        fieldToLabelRatio={secondLevelFieldLabelRatio}
        fieldStyle={style.firstInputInSection}
        fieldLabelStyle={style.weekBeginsLabel}
      />
    </CollapsableSection>
  );
}

export default WkDayCutoffsInput;