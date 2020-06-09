import React from 'react';
import getStyle from './style';
import {
  getMinutesFromHoursAndMinutes,
  getTextOfHoursAndMinutes,
  getHoursAndMinutesFromMinutes
} from '../../../utilities';
import BoxInputFrame from '../../BoxInputFrame';

function getHourOptions(is24hr) {
  let options = [];
  for (let i = -12; i <= 12; i++) {
    const hoursBase = is24hr ? 24 : 12;
    let displayValue = (i + hoursBase) % hoursBase;
    if (!is24hr && displayValue === 0) displayValue = 12;
    options.push({
      value: i,
      name: displayValue
    });
  }
  return options;
}

function DayCutoffInput({
  propName,
  sectionName,
  value,
  changeHandlerFactory,
  label,
  helpText,
  hasProblem,
  problems,
  formId,
  inputRef,
  isInline,
  isActive,
  fieldToLabelRatio,
  fieldStyle,
  fieldLabelStyle
}) {

  const inputNamePrefix = `${sectionName ? sectionName + '-' : ''}${propName}`;
  const hoursInputId = `${inputNamePrefix}-hour-input-${formId}`;
  const _label = label || 'Day Cutoff:';
  const _helpText = helpText || 'Hint: You probably don\'t need to worry about the day cutoff unless you work nights. If you begin in the evening and work past midnight, you can adjust the day cutoff so that your shift is not split across two days.';
  const { hour, minute, is24hr } = value;
  let amPm;
  if (!is24hr) {
    amPm = hour < 0 || hour === 12 ? 'pm' : 'am';
  }
  const is24hrInputsName = `${inputNamePrefix}-is24hr`;

  function inputProcessorFactory(childPropName) {
    return function (childPropValue) {
      const _value = { ...value };
      if (childPropName === 'is24hr') {
        _value[childPropName] = childPropValue && childPropValue !== 'false';
      }
      else if (childPropName !== 'amPm') {
        _value[childPropName] = (
          childPropValue || childPropValue === 0 ?
          parseInt(childPropValue) :
          undefined
        );
      }
      else if (childPropValue === 'am' && hour < 0) {
        _value.hour = hour + 12;
      }
      else if (childPropValue === 'am' && hour === 12) {
        _value.hour = 0;
      }
      else if (childPropValue === 'pm' && hour >= 0 && hour !== 12) {
        _value.hour = hour - 12;
      }
      return _value;
    };
  }

  const completeProblemsAndMessages = getCompleteProblems({ value, problems, hasProblem });
  const completeProblems = completeProblemsAndMessages.problems;
  const { problemMessages } = completeProblemsAndMessages;

  const style = getStyle(fieldStyle, fieldLabelStyle);

  let cutoffDisplay = getCutoffDisplayValue(value);

  return (
    <BoxInputFrame
      label={_label}
      inputId={hoursInputId}
      {...{
        isInline,
        fieldToLabelRatio
      }}
      styles={{ field: style.field, fieldLabel: style.fieldLabel }}
    >
      <div className="select">
        <select
          id={hoursInputId}
          className="select"
          ref={inputRef}
          value={hour}
          onChange={changeHandlerFactory(propName, true, inputProcessorFactory('hour'))}
          disabled={!isActive}
        >
          <option disabled value="">
            Hr
          </option>
          {getHourOptions(is24hr).map(
            option => (
              parseInt(option.name) < 10 ?
              <option value={option.value} key={option.value} style={style.selectOption}>
                &nbsp;{option.name}
              </option> :
              <option value={option.value} key={option.value} style={style.selectOption}>
                {option.name}
              </option>
            )
          )}
        </select>
      </div>
      <span style={style.colon}>:</span>
      <input
        className={`input no-spin${completeProblems.minute ? ' is-danger' : ''}`}
        type="number"
        value={(minute || minute === 0) ? minute : ''}
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('minute'))}
        disabled={!isActive}
        placeholder="min"
        style={style.minutesInput}
      />
      {!is24hr &&
        <div className="select" style={style.amPmInput}>
          <select
            value={amPm}
            onChange={changeHandlerFactory(propName, true, inputProcessorFactory('amPm'))}
            disabled={!isActive}
          >
            <option value="am">
              AM
            </option>
            <option value="pm">
              PM
            </option>
          </select>
        </div>
      }
      {problemMessages.length === 0 &&
        <div style={style.cutoffDisplay}>
          {cutoffDisplay}
        </div>
      }
      <div style={style.is24hrInputGroup}>
        <label className="radio">
          <input
            type="radio"
            name={is24hrInputsName}
            value={false}
            checked={!is24hr}
            onChange={changeHandlerFactory(propName, true, inputProcessorFactory('is24hr'))}
            className={problems && problems.is24hr ? 'is-danger' : undefined}
            disabled={!isActive}
            style={style.is24hrInput}
          />
          AM/PM
        </label>
        <label className="radio">
          <input
            type="radio"
            name={is24hrInputsName}
            value={true}
            checked={is24hr}
            onChange={changeHandlerFactory(propName, true, inputProcessorFactory('is24hr'))}
            className={problems && problems.is24hr ? 'is-danger' : undefined}
            disabled={!isActive}
            style={style.is24hrInput}
          />
          24 Hr.
        </label>
      </div>
      {problemMessages && problemMessages.length > 0 && problemMessages.map(
        msg => (
          <p className="help is-danger" key="msg">{msg}</p>
        )
      )}
      {_helpText &&
        <p className="help">{_helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default DayCutoffInput;

function getCompleteProblems({ problems, value, hasProblem }) {
  const numMinutes = getMinutesFromHoursAndMinutes({ hours: value.hour, minutes: value.minute });
  let completeProblems = (
    problems ?
    { ...problems } :
    (hasProblem ? { hour: true, minute: true } : {})
  );
  let problemMessages = [];
  const max = 12 * 60;
  const min = -1 * max;
  if (numMinutes > max) {
    completeProblems.hour = completeProblems.minute = true;
    const maxTimeText = getTextOfHoursAndMinutes(getHoursAndMinutesFromMinutes(max));
    problemMessages.push(`Invalid time: can't be greater than ${maxTimeText}.`);
  }
  else if (numMinutes < min) {
    completeProblems.hour = completeProblems.minute = true;
    const minTimeText = getTextOfHoursAndMinutes(getHoursAndMinutesFromMinutes(0));
    problemMessages.push(`Invalid time: can't be less than ${minTimeText}.`);
  }
  if (value.minute < 0 || value.minute >= 60) {
    completeProblems.minute = true;
    problemMessages.push('Invalid minutes: can\'t be less than 0 or greater than 59.');
  }
  return {
    problems: completeProblems,
    problemMessages
  };
}

function getCutoffDisplayValue(value) {
  const { hour, minute } = value;
  let hourValueToDisplay, minuteValueToDisplay;
  if (hour < 0) {
    hourValueToDisplay = minute ? Math.abs(hour) - 1 : Math.abs(hour);
    minuteValueToDisplay = minute ? 60 - minute : 0;
  }
  else {
    hourValueToDisplay = hour;
    minuteValueToDisplay = minute || 0;
  }
  const hourDisplay = hourValueToDisplay < 10 ? `0${hourValueToDisplay}` : hourValueToDisplay;
  const minuteDisplay = minuteValueToDisplay < 10 ? `0${minuteValueToDisplay}` : minuteValueToDisplay;
  return `(${hour < 0 ? '-' : '+'}${hourDisplay}:${minuteDisplay})`;
}