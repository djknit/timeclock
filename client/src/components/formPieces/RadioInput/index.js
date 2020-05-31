import React from 'react';
import BoxInputFrame from '../BoxInputFrame';

function RadioInput({
  name,
  value,
  options,
  handleChange,
  label,
  sublabel,
  helpText,
  hasProblem,
  isActive,
  inputRef,
  isInline
}) {

  return (
    <BoxInputFrame
      isRadio={true}
      {...{
        label,
        sublabel,
        isInline
      }}
    >
      {options.map(
        (option, index) => (
          <label className="radio" disabled={!isActive} key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={
                ({ target }) => handleChange({
                  target: {
                    name,
                    value: ( // if boolean values, convert string representations back to boolean 
                      (target.value === 'true' || target.value === 'false') ?
                      target.value === 'true' :
                      target.value
                    )
                  }
                })
              }
              className={hasProblem ? 'is-danger' : undefined}
              disabled={!isActive}
              ref={(index === 0 && inputRef) || undefined}
            />
            {option.label}
          </label>
        )
      )}
    </BoxInputFrame>
  );

  return (
    <Wrapper {...{ label }}>
      <div className="control">
        {options.map(
          (option, index) => (
            <label className="radio" disabled={!isActive} key={option.value}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={
                  ({ target }) => handleChange({
                    target: {
                      name,
                      value: ( // if boolean values, convert string representations back to boolean 
                        (target.value === 'true' || target.value === 'false') ?
                        target.value === 'true' :
                        target.value
                      )
                    }
                  })
                }
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