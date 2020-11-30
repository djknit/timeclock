import React from 'react';
import getStyle from './style';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import {
  getMinutesFromHoursAndMinutes,
  dates as dateUtils
} from '../utilities';
import BoxInputFrame from '../BoxInputFrame';

const { convertDateToMyDate, } = dateUtils;

function getHourOptions(is24hr) {
  let options = [];
  for (let i = 0; i < 24; i++) {
    const hoursBase = is24hr ? 24 : 12;
    let displayValue = i % hoursBase;
    if (!is24hr && displayValue === 0) displayValue = 12;
    options.push({
      value: i,
      name: displayValue
    });
  }
};

function DateAndTimeInput({
  propName,
  sectionName,
  value,
  changeHandlerFactory,
  label,
  sublabel,
  helptText,
  hasProblem,
  problems,
  formId,
  inputRef,
  isInline,
  isActive,
  fieldToLabelRatio,
  fieldStyle,
  fieldLabelStyle,
  labelStyle,
  openToDate
}) {

  const { date, hour, minute, is24hr } = value;
  const sectionNamePortionOfId = sectionName ? `${sectionName}-` : '';
  const inputId = `${sectionNamePortionOfId}${propName}-input-${formId}`;
  const completeProblems = getCompleteProblems({ problems, value, hasProblem });

  function inputProcessorFactory(childPropName) {
    return function processInput(childPropValue) {
      let _value = { ...value };
      if (childPropName === 'date') {
        _value.date = (
          childPropValue ? convertDateToMyDate(childPropValue) : null
        );
      }
      else if (childPropName === 'is24hr') {
        _value.is24hr = childPropValue;
      }
      else if (childPropName !== 'amPm') {
        _value.amPm = (
          childPropValue || childPropValue === 0 ?
          parseInt(childPropValue) :
          undefined
        );
      }
      else if (childPropValue === 'am' && hour >= 12) {
        _value.hour = hour - 12;
      }
      else if (childPropValue === 'pm' && hour < 12) {
      _value.hour = hour + 12;
      }
      return _value;
    };
  }

  const style = getStyle(fieldStyle, labelStyle);

  return (
    <BoxInputFrame
      {...{
        label,
        sublabel,
        isInline,
        inputId
      }}
    >
      <DatePicker
        disabled={!isActive}
        className={`input${completeProblems.date ? ' is-danger' : ''}`}
      />
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

export default DateAndTimeInput;

function getCompleteProblems({ problems, value, hasProblem }) {
  const numMinutes = getMinutesFromHoursAndMinutes({ hours: value.hour, minutes: value.minute });
  let completeProblems = (
    problems ?
    { ...problems } :
    (hasProblem ? { hour: true, minute: true } : {})
  );
  let problemMessages = [];
  const max = (24 * 60) - 1;
  const min = 0;
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
