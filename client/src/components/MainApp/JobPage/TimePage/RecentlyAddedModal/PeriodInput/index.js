import React from 'react';
import getStyle from './style';
import { getInputId } from '../utilities';
import { BoxInputFrame } from '../../../../../formPieces';


function TimePeriodInput({
  propName,
  sectionName,
  value,
  label,
  sublabel,
  hasProblem,
  problems,
  helpText,
  changeHandlerFactory,
  isActive,
  formId,
  inputRef
}) {

  const inputNamePrefix = `${sectionName ? sectionName + '-' : ''}${propName}`;
  const mainSelectInputId = getInputId(formId, 'selectedTimePeriod', inputNamePrefix);

  const style = getStyle();

  return (
    <BoxInputFrame
      label="Show Time Entered In The Past..."
      inputId={mainSelectInputId}
    >
      <div className={`select is-fullwidth${hasProblem ? ' is-danger' : ''}`}>
        <select
          id={inputId}
          ref={inputRef}
          value={value}
          onChange={changeHandlerFactory(propName, true)}
          disabled={!isActive}
        >
          {
            placeholder && (
              <option disabled value="">
                {placeholder}
              </option>
            )
          }
          {
            options.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.isDisabled}
              >
                {option.name}
              </option>
            ))
          }
        </select>
      </div>
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default TimePeriodInput;
