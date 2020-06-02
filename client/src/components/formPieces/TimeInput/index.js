import React from 'react';
import BoxInputFrame from '../BoxInputFrame';
import getStyle from './style';

function TimeInput({
  name,
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

  const hoursInputId = `${sectionName ? sectionName + '-' : ''}${name}-hours-input-${formId}`;

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
      />
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default TimeInput;