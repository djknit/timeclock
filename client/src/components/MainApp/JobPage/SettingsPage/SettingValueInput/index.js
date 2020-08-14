import React from 'react';
import { getTimezoneOptions, getWeekdayOptions } from '../../utilities';
import getStyle from './style';
import { SelectInput, DayCutoffInput, WageInput } from '../../../../formPieces';

function SettingValueInput({
  settingName,
  value,
  wageInputRefs,
  wageContentToggle,
  problems,
  topLevelFieldLabelRatio,
  secondLevelFieldLabelRatio,
  ...otherProps
}) {

  const style = getStyle();

  const commonAttrs = {
    ...otherProps,
    hasProblem: problems,
    value,
    labelStyle: style.label
  };
  const attrsForAllExceptWage = {
    ...commonAttrs,
    fieldToLabelRatio: topLevelFieldLabelRatio
  };

  switch(settingName) {

    case 'timezone':
      return (
        <SelectInput
          {...attrsForAllExceptWage}
          options={getTimezoneOptions()}
          placeholder="The timezone your hours are counted in..."
        />
      );
    
    case 'wage':
      return (
        value ? (
          <WageInput
            {...commonAttrs}
            {...{
              problems,
              topLevelFieldLabelRatio,
              secondLevelFieldLabelRatio
            }}
            refs={wageInputRefs}
            contentToggle={wageContentToggle}
          />
        ) : (
          <></>
        )
      );
    
    case 'weekBegins':
      return (
        <SelectInput
          {...attrsForAllExceptWage}
          options={getWeekdayOptions()}
          placeholder="Select day on which a new work week begins..."
          helpText="Hint: Use the day that begins a new week on your work schedule or a new pay period even if you do not personally work that day."
        />
      );

    case 'dayCutoff':
      return (
        value ? (
          <DayCutoffInput {...attrsForAllExceptWage} {...{ problems }} />
        ) : (
          <></>
        )
      );

  }
}

export default SettingValueInput;