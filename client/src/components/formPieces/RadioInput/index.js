import React from 'react';
import getStyle from './style';
import BoxInputFrame from '../BoxInputFrame';

function RadioInput({
  propName,
  value,
  options,
  changeHandlerFactory,
  label,
  sublabel,
  helpText,
  hasProblem,
  isActive,
  isInline,
  fieldToLabelRatio,
  fieldStyle,
  inputRef
}) {

  function isSelected(option) {
    return option.value === value;
  }

  function getSelectedOptionRef() {
    for (let i = 0; i < options.length; i++) {
      if (isSelected(options[i])) return options[i].ref;
    }
  }

  const style = getStyle();

  function processValue(_value) {
    return (
      (_value === 'true' || _value === 'false') ?
      _value === 'true' :
      _value
    );
  }

  return (
    <BoxInputFrame
      isRadio={true}
      {...{
        label,
        sublabel,
        helpText,
        isInline,
        fieldToLabelRatio
      }}
      selectedRadioInput={inputRef || getSelectedOptionRef()}
      styles={{ field: fieldStyle }}
    >
      {options.map(option => (
        <label className="radio" disabled={!isActive} key={option.value} style={style.label}>
          <input
            type="radio"
            name={propName}
            value={option.value}
            checked={value === option.value}
            onChange={changeHandlerFactory(propName, true, processValue)}
            ref={(isSelected(option) && inputRef) || option.ref}
            className={hasProblem ? 'is-danger' : undefined}
            disabled={!isActive}
            style={style.input}
          />
          {option.label}
        </label>
      ))}
      {/* {helpText && (
        <p className="help">{helpText}</p>
      )} */}
    </BoxInputFrame>
  );
}

export default RadioInput;
