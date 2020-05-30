import React from 'react';

function RadioInput({
  name,
  value,
  options,
  handleChange,
  label,
  helpText,
  hasProblem,
  isActive,
  inputRef,
}) {

  return (
    <Wrapper {...{ label }}>
      <div className="control">
        {options.map(
          (option, index) => (
            <label className="radio" disabled={!isActive}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                className={hasProblem ? 'is-danger' : undefined}
                disabled={!isActive}
                ref={(index === 0 && inputRef) || undefined}
              />
              {option.label}
            </label>
          )
        )}
      </div>
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </Wrapper>
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