import React from 'react';
import getStyle from './style';
import {
  getInputId, calculateInputValueChange, getCompleteProblems
} from './utilities';
import BoxInputFrame from '../BoxInputFrame';

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
    return (
      childPropValue => calculateInputValueChange(childPropName, childPropValue, value)
    );
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
    onChange: changeHandlerFactory(propName, true, inputProcessorFactory('is24hr'), 'is24hr'),
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
        helpText,
        problemMessages,
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
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('hour'), 'hour')}
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
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('minute'), 'minute')}
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
            onChange={changeHandlerFactory(propName, true, inputProcessorFactory('amPm'), 'amPm')}
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
      {/* {problemMessages && problemMessages.map(
        msg => (
          <p className="help is-danger" key={msg}>{msg}</p>
        )
      )}
      {helpText && (
        <p className="help">{helpText}</p>
      )} */}
    </BoxInputFrame>
  );
}

export default TimeInput;
