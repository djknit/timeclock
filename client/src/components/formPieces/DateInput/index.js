import React from 'react';
import { dates as dateUtilities } from '../../utilities';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import BoxInputFrame from '../BoxInputFrame';

const { convertDateToMyDate, getDate } = dateUtilities;

function DateInput({
  name,
  sectionName,
  value,
  label,
  sublabel,
  placeholder,
  hasProblem,
  helpText,
  handleChange,
  isActive,
  formId,
  isInline,
  inputRef,
  fieldToLabelRatio
}) {

  function reportChange(date) {
    handleChange({
      target: {
        name,
        value: date ? convertDateToMyDate(date) : null
      }
    });
  }

  const inputId = `${sectionName ? sectionName + '-' : ''}${name}-input-${formId}`;
  let inputClassName = 'input';
  if (hasProblem) inputClassName += ' is-danger';

  return (
    <BoxInputFrame
      {...{
        label,
        sublabel,
        isInline,
        inputId,
        fieldToLabelRatio
      }}
    >
      <DatePicker
        disabled={!isActive}
        className={inputClassName}
        onChange={reportChange}
        selected={value ? getDate(value) : null}
        placeholderText={placeholder}
        id={inputId}
        ref={inputRef}
      />
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default DateInput;