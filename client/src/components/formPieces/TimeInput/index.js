import React from 'react';
import getStyle from './style';
import { constants } from '../utilities';
import BoxInputFrame from '../BoxInputFrame';
import time from 'timeclock-shared-resources/utilities/jobData/time';

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
        const converter = childPropValue ? convertAmPmTimeTo24hr : convert24hrTimeToAmPm;
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

  const { hour, minute,  } = value || {};

  let inputIdPrefix = sectionName || '';
  inputIdPrefix += `${propName}-input-${formId}`;
  const hourInputId = `${inputIdPrefix}-hour`;

  const { problems, problemMessages } = getCompleteProblems({
    problems: problemsProp,
    value,
    hasProblem
  });
  const style = getStyle(labelStyle, fieldStyle);

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
        className={`input no-spin${problems.hour ? ' is-danger' : ''}`}
        type="number"
        value={hour || hour === 0 ? hour : ''}
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('hour'))}
        disabled={!isActive}
        ref={inputRef}
        placeholder="Hr"
        style={style.hourInput}
      />
      <span style={style.colon}>:</span>
      <input
        className={`input no-spin${problems.minute ? ' is-danger' : ''}`}
        type="number"
        value={minute || minute === 0 ? minute : ''}
        onChange={changeHandlerFactory(propName, true, inputProcessorFactory('minute'))}
        disabled={!isActive}
        placeholder="min"
        style={style.minuteInput}
      />
      {problemMessages && problemMessages.map(
        msg => (
          <p className="help is-danger" key={msg}>{msg}</p>
        )
      )}
      {helpText &&
        <p className="help">{helpText}</p>
      }
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
    problems[isHour ? 'hour' : 'minute'] = true;
    problemMessages.push(
      `Invalid ${isHour} value: can\'t be less than ${minimum} or greater than ${max}.`
    );
  };
  if (is24hr && (hour < 0 || hour > 23)) {
    problems.hour = true;
    addInvalidNumberProbs('hour', 0, 23);
  }
  else if (hour < 1 || hour > 12) {
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

function getTimeInputStore(timeParam = {}) {
  let _time = {
    hour: timeParam.hour,
    minute: timeParam.minute,
    is24hr: !!timeParam.is24hr,
    amPm: timeParam.amPm
  };

  return {
    get hour() {
      return _time.hour;
    },
    get minute() {
      return _time.minute;
    },
    get is24hr() {
      return _time.is24hr;
    },
    get amPm() {
      if (_time.is24hr) return;
      return (_time.amPm || 'am');
    },
    set hour(_hour) {
      _time.hour = parseInt(_hour) || undefined;
    },
    set minute(_minute) {
      _time.minute = parseInt(_minute) || undefined;
    },
    set is24hr(_is24hr) {
      if (_is24hr === _time.is24hr) return;
      if (_is24hr) {
        Object.assign(_time, convertAmPmTimeTo24hr(_time));
      }
      else {
        Object.assign(_time, convert24hrTimeToAmPm(_time));
      }
    },
    set amPm(_amPm) {
      _time.amPm = _amPm;
    }
  };
}

function convertAmPmTimeTo24hr(_amPmTime) {
  let _24hrTime = {
    is24hr: true,
    amPm: undefined,
    minute: _amPmTime.minute
  };
  const _hour = _amPmTime.hour;
  if (!_hour && _hour !== 0) {
    _24hrTime.hour = undefined;
    return _24hrTime;
  }
  if (_hour === 12) {
    _hour = 0;
  }
  if (_amPmTime.amPm === 'pm' && _hour >= 0 && _hour < 12) {
    _hour += 12;
  }
  return {
    ..._24hrTime,
    hour: _hour
  };
}

function convert24hrTimeToAmPm(_24hrTime) {
  let _amPmTime = {
    is24hr: false,
    minute: _24hrTime.minute
  };
  const _hour = _24hrTime.hour;
  if ((!_hour && _hour !== 0) || _hour < 0 || _hour > 23) {
    return {
      ..._amPmTime,
      hour: _hour,
      amPm: 'am'
    };
  }
  return {
    ..._amPmTime,
    amPm: _hour >= 12 ? 'pm' : 'am',
    hour: (_hour % 12) || 12
  };
}
