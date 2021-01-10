import React from 'react';
import getStyle from './style';
import {
  constants, convertAmPmTimeTo24hr, convert24hrTimeToAmPm, getInputId
} from '../utilities';
import BoxInputFrame from '../BoxInputFrame';

const { minsPerHr } = constants;

function TimeInput({
  isInline,
  label,
  sublabel,
  value,
  propName,
  changeHandlerFactory,
  isActive,
  formId,
  inputRef,
  helpText,
  sectionName,
  hasProblem,
  problems: problemsProp,
  fieldToLabelRatio,
  labelStyle,
  fieldStyle
}) {

  function inputProcessorFactory(childPropName) {
    return function(childPropValue) {
      let _value = { ...value };
      if (childPropName === 'is24hr' && childPropValue !== value[childPropName]) {
        const _newIs24hr = childPropValue && childPropValue !== 'false'; 
        const converter = _newIs24hr ? convertAmPmTimeTo24hr : convert24hrTimeToAmPm;
        Object.assign(_value, converter(value));
      }
      else if (childPropName !== 'amPm') {
        _value[childPropName] = (
          childPropValue || childPropValue === 0 ?
          parseInt(childPropValue) :
          undefined
        );
      }
      else {
        _value[childPropName] = childPropValue;
      }
      return _value;
    };
  }

  const { hour, minute, amPm, is24hr } = value || {};

  const inputNamePrefix = sectionName ? `${sectionName}-${propName}` : propName;
  const hourInputId = getInputId(formId, 'hour', inputNamePrefix);
  const _getFullClassName = (_className, hasProblem) => {
    return hasProblem ? `${_className} is-danger` : _className;
  };

  const { problems, problemMessages } = getCompleteProblems({
    problems: problemsProp,
    value,
    hasProblem
  });
  const style = getStyle(labelStyle, fieldStyle);

  let is24hrInputsCommonAttrs = {
    type: 'radio',
    name: getInputId(formId, 'is24hr', inputNamePrefix),
    onChange: changeHandlerFactory(propName, true, inputProcessorFactory('is24hr')),
    className: (problems && problems.is24hr) ? 'is-danger' : undefined,
    disabled: !isActive,
    style: style.is24hrInput
  };

  return (
    <BoxInputFrame
      isInline={isInline !== false}
      {...{
        label,
        sublabel,
        fieldToLabelRatio
      }}
      inputId={hourInputId}
      styles={style}
    >
      <input
        id={hourInputId}
        className={_getFullClassName('input no-spin', problems.hour)}
        type="number"
        value={hour || hour === 0 ? hour : ''}
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('hour'))}
        disabled={!isActive}
        ref={inputRef}
        placeholder="Hr"
        style={style.hoursInput}
      />
      <span style={style.colon}>:</span>
      <input
        className={_getFullClassName('input no-spin', problems.minute)}
        type="number"
        value={minute || minute === 0 ? minute : ''}
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('minute'))}
        disabled={!isActive}
        placeholder="min"
        style={style.minutesInput}
      />
      {!is24hr && (
        <div
          className={_getFullClassName('select', problems.amPm)}
          style={style.amPmInput}
        >
          <select
            value={amPm}
            onChange={changeHandlerFactory(propName, true, inputProcessorFactory('amPm'))}
            disabled={!isActive}
          >
            <option value="am">AM</option>
            <option value="pm">PM</option>
          </select>
        </div>
      )}
      <div style={style.is24hrInputGroup}>
        <label className="radio">
          <input
            {...is24hrInputsCommonAttrs}
            value={false}
            checked={!is24hr}
          />
          AM/PM
        </label>
        <label className="radio">
          <input
            {...is24hrInputsCommonAttrs}
            value={true}
            checked={is24hr}
          />
          24 Hr.
        </label>
      </div>
      {problemMessages && problemMessages.map(
        msg => (
          <p className="help is-danger" key={msg}>{msg}</p>
        )
      )}
      {helpText && (
        <p className="help">{helpText}</p>
      )}
    </BoxInputFrame>
  );
}

export default TimeInput;

function getCompleteProblems({ problems, value, hasProblem }) {
  let _problems = (
    problems && { ...problems } 
  ) || (
    hasProblem && { hour: true, minute: true }
  ) || (
    {}
  );
  let problemMessages = [];
  const { minute, hour, is24hr } = value;
  const addInvalidNumberProbs = (isHour, minimum, max) => {
    _problems[isHour ? 'hour' : 'minute'] = true;
    problemMessages.push(
      `Invalid ${isHour} value: can\'t be less than ${minimum} or greater than ${max}.`
    );
  };
  if (is24hr && (hour < 0 || hour > 23)) {
    _problems.hour = true;
    addInvalidNumberProbs('hour', 0, 23);
  }
  if (!is24hr && (hour < 1 || hour > 12)) {
    _problems.hour = true;
    addInvalidNumberProbs('hour', 1, 12)
  }
  if (minute < 0 || minute >= minsPerHr) {
    _problems.minute = true;
    addInvalidNumberProbs('minute', 0, 59);
  }
  return {
    problems: _problems,
    problemMessages
  };
}
