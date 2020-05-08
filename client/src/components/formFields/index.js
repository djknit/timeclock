import React from './node_modules/react';

function Form({
  isActive,
  formId,
  fields,
  handleChange
}) {

  return fields.map(field => {
    const { type, name, value, label, placeholder, hasProblem, iconClass, helpText } = field;
    const inputId = `${name}-input-${formId}`;
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
  });
}

function mapFieldsDataToJsx(fields, hasSuccess, isLoading, handleChange, formName, isActive) {
  return fields.map((field, index) => {
    const { name, value, label, placeholder, hasProblem, iconClass, helpText } = field;
    const inputId = `${name}-input-${formId}`;
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
            disabled={hasSuccess || isLoading}
            className={hasProblem && !hasSuccess ? 'input is-danger' : 'input'}
            tabIndex={isActive ? (index + 1) : -1}
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
  });
}

export default Form;