import React from 'react';
import { getTimezoneOptions, getWeekdayOptions } from '../../../utilities';
import getStyle from './style';
import { SelectInput, DayCutoffInput, WageInput } from '../../../../../formPieces';

function Input({
  settingName,
  value,
  ...otherProps
}) {

  const style = getStyle();

  const commonAttrs = {
    ...otherProps,
    value,
    labelStyle: style.label
  };

  switch(settingName) {

    case 'timezone':
      return (
        <SelectInput
          {...commonAttrs}
          options={getTimezoneOptions()}
          placeholder="The timezone your hours are counted in..."
        />
      );
    
    case 'wage':
      return (
        <WageInput {...otherProps} />
      );
    
    case 'weekBegins':
      return (
        <SelectInput
          {...commonAttrs}
          options={getWeekdayOptions()}
          placeholder="Select day on which a new work week begins..."
          helpText="Hint: Use the day that begins a new week on your work schedule or a new pay period even if you do not personally work that day."
        />
      );

    case 'dayCutoff':
      return (
        value ? (
          <DayCutoffInput {...commonAttrs} />
        ) : (
          <></>
        )
      );

  }
}

export default Input;