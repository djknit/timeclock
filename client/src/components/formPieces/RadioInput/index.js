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
  fieldToLabelRatio
}) {

  function getSelectedOptionRef() {
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) return options[i].ref;
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
        isInline,
        fieldToLabelRatio
      }}
      selectedRadioInput={getSelectedOptionRef()}
    >
      {options.map(
        (option, index) => (
          <label className="radio" disabled={!isActive} key={option.value} style={style.label}>
            <input
              type="radio"
              name={propName}
              value={option.value}
              checked={value === option.value}
              onChange={changeHandlerFactory(propName, true, processValue)}
              ref={option.ref}
              className={hasProblem ? 'is-danger' : undefined}
              disabled={!isActive}
              style={style.input}
            />
            {option.label}
          </label>
        )
      )}
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default RadioInput;

function Wrapper({ children, label }) {
  return (
    label ?
    <fieldset>
      <legend className="label">{label}</legend>
      {children}
    </fieldset> :
    <>{children}</>
  );
}