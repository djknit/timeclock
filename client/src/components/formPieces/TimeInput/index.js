import React from 'react';
import getStyle from './style';
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
  fieldToLabelRatio,
  labelStyle,
  fieldStyle
}) {

  function inputProcessorFactory(childPropName) {
    return function(childPropValue) {
      let _value = { ...value };
      if (childPropName === 'is24hr') {
        _value[childPropName] = childPropValue;
      }
      else if (childPropName !== 'amPm') {
        _value[childPropName] = (
          childPropValue || childPropValue === 0 ?
          parseInt(childPropValue) :
          undefined
        );
      }
      else if (childPropValue === 'am' && value.hour >= 12) {
        _value.hour -= 12;
      }
      else if (childPropValue === 'pm' && value.hour < 12) {
        _value.hour += 12;
      }
      return _value;
    };
  }


  let inputIdPrefix = sectionName || '';
  inputIdPrefix += `${propName}-input-${formId}`;
  const hourInputId = `${inputIdPrefix}-hour`;

  const style = getStyle(labelStyle, fieldStyle);

  return (
    <BoxInputFrame
      isInline={isInline !== false}
      {...{
        label
      }}
      inputId={hourInputId}
      styles={style}
    >

    </BoxInputFrame>
  );
}

export default TimeInput;
