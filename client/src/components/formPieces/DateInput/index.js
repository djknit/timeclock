import React from 'react';
import { dates as dateUtilities } from '../../utilities';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css'; // for setting popper z-index
import DatePicker from 'react-datepicker';
import getStyle from './style';
import BoxInputFrame from '../BoxInputFrame';

const { convertDateToMyDate, getDate } = dateUtilities;

function DateInput({
  propName,
  sectionName,
  value,
  label,
  sublabel,
  placeholder,
  hasProblem,
  helpText,
  changeHandlerFactory,
  isActive,
  formId,
  isInline,
  inputRef,
  fieldToLabelRatio,
  labelStyle,
  datePickerProps,
  fieldStyle
}) {

  function processInput(inputDate) {
    return inputDate ? convertDateToMyDate(inputDate) : null;
  }

  const inputId = `${sectionName ? sectionName + '-' : ''}${propName}-input-${formId}`;
  let inputClassName = 'input';
  if (hasProblem) inputClassName += ' is-danger';

  const style = getStyle(labelStyle, fieldStyle);

  return (
    <BoxInputFrame
      {...{
        label,
        sublabel,
        isInline,
        inputId,
        fieldToLabelRatio
      }}
      styles={style}
    >
      <DatePicker
        disabled={!isActive}
        className={inputClassName}
        onChange={changeHandlerFactory(propName, false, processInput)}
        selected={value ? getDate(value) : null}
        placeholderText={placeholder}
        id={inputId}
        ref={inputRef}
        autoComplete="off"
        {...(datePickerProps || {})}
      />
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default DateInput;