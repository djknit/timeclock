import React from 'react';

function TextInput({
  name,
  value,
  label,
  placeholder,
  hasProblem,
  iconClass,
  helpText,
  handleChange,
  isActive,
  index,
  formId,
  type
}) {

  const inputId = `${name}-input-${formId}`;

  let typeAttrVal, autocompleteAttrVal;
  if (type === 'password' || type === 'newPassword') {
    typeAttrVal = 'password';
    autocompleteAttrVal = type === 'password' ? 'current-password' : 'new-password';
  }
  else typeAttrVal = type;

  return (
    <div className="field">
      <label className="label" htmlFor={inputId}>{label}</label>
      <div className={`control${iconClass ? ' has-icons-left' : ''}`}>
        <input
          id={inputId}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={!isActive}
          className={hasProblem ? 'input is-danger' : 'input'}
          tabIndex={isActive ? (index + 1) : -1}
          type={typeAttrVal}
          autoComplete={autocompleteAttrVal}
        />
        {iconClass &&
          <span className="icon is-small is-left">
            <i className={iconClass}></i>
          </span>
        }
        {helpText &&
          <p className="help">{helpText}</p>
        }
      </div>
    </div>
  );
}

export default TextInput;