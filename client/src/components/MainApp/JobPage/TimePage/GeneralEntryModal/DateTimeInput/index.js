import React from 'react';
import getStyle from './style';
import { DateInput, TimeInput, SectionLabel } from '../../../../../formPieces';

function DateTimeInput({
  sectionLabel,
  timeInputProps,
  dateInputProps,
  changeHandlerFactory,
  formId,
  sectionName,
  isActive,
  inputRef,
  handleDatepickerPopperToggle,
  labelAreaRef,
  isLast,
  inputFieldMarginBottom,
  sectionLabelMarginBottom
}) {

  const style = getStyle(isLast, inputFieldMarginBottom, sectionLabelMarginBottom);

  const commonInputProps = {
    changeHandlerFactory,
    formId,
    sectionName,
    isActive,
    isInline: true
  };

  return (
    <>
      <SectionLabel areaRef={labelAreaRef} areaStyle={style.sectionLabelArea}>
        {sectionLabel}
      </SectionLabel>
      <DateInput
        label="Date:"
        {...dateInputProps}
        {...commonInputProps}
        {...{
          formId,
          inputRef
        }}
        datePickerProps={{
          popperPlacement: 'top-start',
          onCalendarOpen: () => handleDatepickerPopperToggle(true, !isLast),
          onCalendarClose: () => handleDatepickerPopperToggle(false, !isLast)
        }}
        fieldStyle={style.field}
        placeholder="Type or select date..."
      />
      <TimeInput
        label="Time:"
        {...timeInputProps}
        {...commonInputProps}
        fieldStyle={style.timeField}
      />
    </>
  );
}

export default DateTimeInput;
