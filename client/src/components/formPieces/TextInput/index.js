import React from 'react';
import getStyle from './style';
import BoxInputFrame from '../BoxInputFrame';

function TextInput({
  name,
  value,
  label,
  sublabel,
  placeholder,
  hasProblem,
  iconClass,
  helpText,
  handleChange,
  isActive,
  formId,
  type,
  inputRef,
  isInline
}) {

  const inputId = `${name}-input-${formId}`;

  let typeAttrVal, autocompleteAttrVal;
  if (type === 'password' || type === 'newPassword') {
    typeAttrVal = 'password';
    autocompleteAttrVal = type === 'password' ? 'current-password' : 'new-password';
  }
  else if (type === 'username') {
    typeAttrVal = 'text';
    autocompleteAttrVal = 'username';
  }
  else {
    typeAttrVal = type;
    autocompleteAttrVal = type === 'email' ? 'email' : 'off';
  }

  const style = getStyle();

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
      <input
        id={inputId}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={!isActive}
        className={hasProblem ? 'input is-danger' : 'input'}
        type={typeAttrVal}
        autoComplete={autocompleteAttrVal}
        ref={inputRef}
      />
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

export default TextInput;