import React from 'react';
import BoxInputFrame from '../BoxInputFrame';
import getStyle from './style';

function TimeInput({
  propName,
  sectionName,
  value,
  label,
  sublabel,
  hasProblem,
  helpText,
  handleChange,
  isActive,
  formId,
  inputRef,
  isInline,
  fieldToLabelRatio
}) {

  const hoursInputId = `${sectionName ? sectionName + '-' : ''}${propName}-hours-input-${formId}`;

  const { hours, minutes, is24hr } = value;

  const style = getStyle();

  function reportChange() {

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
        className={hasProblem ? 'input is-danger' : 'input'}
        type="number"
        style={style.hoursInput}
        onChange={handleChange}
        disabled={!isActive}
        ref={inputRef}
        step={1}
      />
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default TimeInput;