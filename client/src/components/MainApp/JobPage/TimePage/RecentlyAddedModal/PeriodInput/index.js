import React from 'react';
import getStyle from './style';
import {
  getInputId,
  timePeriodOptions,
  getInputProblems,
  customPeriodUnitOptions,
  getReverseProcessedInputValue
} from '../utilities';
import { BoxInputFrame } from '../../../../../formPieces';


function TimePeriodInput({
  helpText,
  changeHandlerFactory,
  isActive,
  formId,
  inputRef,
  ...inputValues
}) {

  const {
    timePeriodChoice,
    customPeriodNumber,
    customPeriodUnit,
    wasNumberInputTouched
  } = inputValues;
  console.log(timePeriodChoice)

  const {
    problems, problemMessages
  } = getInputProblems({ timePeriodChoice, customPeriodNumber, wasNumberInputTouched });

  const inputNamePrefix = 'time-period';
  const mainSelectInputId = getInputId(formId, 'selectedTimePeriod', inputNamePrefix);
  let numInputClassName = 'input no-spin';
  if (problems && problems.customPeriodNumber) numInputClassName += ' is-danger';

  const _commonInputAttrs = _propName => ({
    value: getReverseProcessedInputValue(_propName, inputValues),
    onChange: changeHandlerFactory(_propName),
    disabled: !isActive
  });

  const style = getStyle();

  return (
    <BoxInputFrame
      label="Show Time Entered In The Past..."
      inputId={mainSelectInputId}
      styles={{ label: style.label}}
    >
      <div className="select">
        <select
          id={mainSelectInputId}
          ref={inputRef}
          {..._commonInputAttrs('timePeriodChoice')}
          style={style.mainSelect}
        >
          {timePeriodOptions.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.isDisabled}
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
      {timePeriodChoice === 'custom' && (
        <>
          <i className="fas fa-long-arrow-alt-right" style={style.arrow} />
          <input
            className={numInputClassName}
            type="number"
            {..._commonInputAttrs('customPeriodNumber')}
            value={customPeriodNumber || customPeriodNumber === 0 ? customPeriodNumber : ''}
            onChange={changeHandlerFactory('customPeriodNumber')}
            disabled={!isActive}
            placeholder="00.00"
            style={style.customNumInput}
          />
          <div className="select">
            <select
              value={customPeriodUnit}
              onChange={changeHandlerFactory('customPeriodUnit')}
              disabled={!isActive}
              style={style.customUnitInput}
            >
              {customPeriodUnitOptions.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.isDisabled}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      {problemMessages && problemMessages.length > 0 && (
        <p className="help">
          {problemMessages.join(' ')}
        </p>
      )}
    </BoxInputFrame>
  );
}

export default TimePeriodInput;
