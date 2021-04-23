import React from 'react';
import getStyle from './style';
import {
  getInputId,
  getHourOptions,
  inputProcessorFactoryFactory,
  getCompleteProblems,
  getCutoffDisplayValue
} from './utilities';
import BoxInputFrame from '../BoxInputFrame';

const defaultHelpText = 'Hint: You probably don\'t need a custom day cutoff unless you work late nights. If you begin in the evening and work past midnight, you can adjust the day cutoff so that your shift is not split across two days.';

function DayCutoffInput({
  propName,
  sectionName,
  value,
  changeHandlerFactory,
  label,
  helpText = defaultHelpText,
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
  inputId: inputIdProp
}) {

  const inputNamePrefix = `${sectionName ? sectionName + '-' : ''}${propName}`;
  const hoursInputId = inputIdProp || getInputId(formId, 'hour', inputNamePrefix);
  const is24hrInputsName = getInputId(formId, 'is24hr', inputNamePrefix);

  const _label = label || 'Day Cutoff:';
  let cutoffDisplay = getCutoffDisplayValue(value);
  const {
    problems: completeProblems,
    problemMessages
  } = getCompleteProblems({ value, problems, hasProblem });

  const { hour, minute, is24hr } = value;
  let amPm;
  if (!is24hr) amPm = (hour < 0 || hour === 12) ? 'pm' : 'am';
  const inputProcessorFactory = inputProcessorFactoryFactory(value);

  const style = getStyle(fieldStyle, fieldLabelStyle);
  const inputFrameStyles = {
    field: fieldStyle,
    fieldLabel: fieldLabelStyle,
    label: labelStyle
  };

  return (
    <BoxInputFrame
      label={_label}
      inputId={hoursInputId}
      {...{
        isInline,
        fieldToLabelRatio,
        problemMessages,
        helpText
      }}
      styles={inputFrameStyles}
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
    </BoxInputFrame>
  );
}

export default DayCutoffInput;
