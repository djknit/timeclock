import React from 'react';
import getStyle from './style';
import {
  getHoursAndMinutesFromMinutes,
  getMinutesFromHoursAndMinutes,
  getTextOfHoursAndMinutes
} from '../../utilities';
import BoxInputFrame from '../BoxInputFrame';

function TimeInput({
  propName,
  sectionName,
  value,
  max, // max and min should be integers equal to number of minutes
  min,
  label,
  sublabel,
  hasProblem,
  problems,
  helpText,
  changeHandlerFactory,
  isActive,
  formId,
  inputRef,
  isInline,
  fieldToLabelRatio
}) {

  const hoursInputId = `${sectionName ? sectionName + '-' : ''}${propName}-hours-input-${formId}`;

  const { hours, minutes } = value;
  
  const completeProblemInfo = getCompleteProblems({ value, max, min, problems, hasProblem });
  const { problemMessages } = completeProblemInfo;
  const _problems = completeProblemInfo.problems;

  const style = getStyle();

  function inputProcessorFactory(childPropName) {
    return function (childPropValue) {
      const _value = { ...value };
      _value[childPropName] = (
        childPropValue || childPropValue === 0 ?
        parseInt(childPropValue) :
        undefined
      );
      return _value;
    };
  }

  return (
    <BoxInputFrame
      {...{
        label,
        sublabel,
        isInline,
        fieldToLabelRatio
      }}
      inputId={hoursInputId}
    >
      <input
        id={hoursInputId}
        className={`input no-spin${_problems.hours ? ' is-danger' : ''}`}
        type="number"
        value={hours || hours === 0 ? hours : ''}
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('hours'))}
        disabled={!isActive}
        ref={inputRef}
        placeholder="Hrs"
        style={style.hoursInput}
      />
      <span style={style.colon}>:</span>
      <input
        className={`input no-spin${_problems.minutes ? ' is-danger' : ''}`}
        type="number"
        value={minutes || minutes === 0 ? minutes : ''}
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('minutes'))}
        disabled={!isActive}
        placeholder="min"
        style={style.minutesInput}
      />
      {problemMessages && problemMessages.map(
        msg => (
          <p className="help is-danger" key="msg">{msg}</p>
        )
      )}
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default TimeInput;

function getCompleteProblems({ problems, max, min, value, hasProblem }) {
  const numMinutes = getMinutesFromHoursAndMinutes(value);
  let _problems = (
    problems ?
    { ...problems } :
    (hasProblem ? { hours: true, minutes: true } : {})
  );
  let problemMessages = [];
  if ((max || max === 0) && numMinutes > max) {
    _problems.hours = _problems.minutes = true;
    const maxTimeText = getTextOfHoursAndMinutes(getHoursAndMinutesFromMinutes(max));
    problemMessages.push(`Invalid time: can't be greater than ${maxTimeText}.`);
  }
  else if ((min || min === 0) && numMinutes < min) {
    _problems.hours = _problems.minutes = true;
    const minTimeText = getTextOfHoursAndMinutes(getHoursAndMinutesFromMinutes(min));
    problemMessages.push(`Invalid time: can't be less than ${minTimeText}.`);
  }
  if (value.minutes < 0 || value.minutes >= 60) {
    _problems.minutes = true;
    problemMessages.push('Invalid minutes: can\'t be less than 0 or greater than 59.');
  }
  return {
    problems: _problems,
    problemMessages
  };
}