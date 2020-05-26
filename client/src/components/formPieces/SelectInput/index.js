import React from 'react';
import BoxInputFrame from '../BoxInputFrame';

function selectInput({
  name,
  value,
  options,
  handleChange,
  label,
  sublabel,
  helpText,
  placeholder,
  iconClass,
  hasProblem,
  isActive,
  formId,
  inputRef,
  isInline
}) {

  const inputId = `${name}-input-${formId}`;

  return (
    <BoxInputFrame
      {...{
        label,
        inputId,
        sublabel,
        isInline
      }}
      hasIcon={iconClass ? 'left' : false}
    >
      <div className="select is-fullwidth">
        <select
          id={inputId}
          ref={inputRef}
          value={value}
          onChange={({ target }) => {
            handleChange(target.value === '' ? null : target.value);
          }}
        >
          {
            placeholder && (
              <option disabled value="">
                {placeholder}
              </option>
            )
          }
          {
            options.map((option, index) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.isDisabled}
              >
                {option.name}
              </option>
            ))
          }
        </select>
      </div>
    </BoxInputFrame>
  );
}

export default selectInput;