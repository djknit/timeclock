import React from 'react';
import { getTimezoneOptions } from '../../../utilities';
import { SelectInput, DayCutoffInput, WageInput } from '../../../../../formPieces';

function Input({
  settingName,
  ...otherProps
}) {

  switch(settingName) {

    case 'timezone':
      return (
        <SelectInput
          {...otherProps}
          // fieldLabelStyle={{alignText: 'left'}}
          labelStyle={{ textAlign: 'left'}}
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
        <SelectInput {...otherProps} />
      );

    case 'dayCutoff':
      return (
        <DayCutoffInput {...otherProps} />
      );
      
  }
}

export default Input;