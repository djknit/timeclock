import React from 'react';
import BoxInputFrame from '../BoxInputFrame';

function selectInput({
  name,
  sectionName,
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
  isInline,
  fieldToLabelRatio
}) {

  const inputId = `${sectionName ? sectionName + '-' : ''}${name}-input-${formId}`;

  return (
    <BoxInputFrame
      {...{
        label,
        inputId,
        sublabel,
        isInline,
        fieldToLabelRatio
      }}
      hasIcon={iconClass ? 'left' : false}
    >
      <div className={`select is-fullwidth${hasProblem ? ' is-danger' : ''}`}>
        <select
          name={name}
          id={inputId}
          ref={inputRef}
          value={value}
          onChange={handleChange}
          disabled={!isActive}
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
      {iconClass &&
        <span className="icon is-small is-left">
          <i className={iconClass}></i>
        </span>
      }
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default selectInput;