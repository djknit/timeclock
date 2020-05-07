import React from 'react';

function Form({
  isActive,
  formName,
  hasSuccess,
  hasProblem,
  isLoading,
  showInstructions,
  successMessage,
  instructions,
  problemMessage,
  fields,
  handleChange
}) {

  const formId = `${formName}-form`;

  return (
    <form id={formId}>
      {showInstructions &&
        <p className="help">
          You must create a username OR provide an e-mail address. You may also choose to do both. If you enter a username and an email address, you can use
          either to sign in. Usernames are case-sensitive; email addresses are not. If you provide an email, you will be able to use it to recover your password.
        </p>
      }
      {hasSuccess &&
        <div className="notification is-success has-shadow">
          
        </div>
      }
      {hasProblem &&
        <div className="notification is-danger has-shadow">
          {problemMessage}
        </div>
      }
      {mapFieldsDataToJsx(fields, hasSuccess, isLoading, handleChange, formName)}
    </form>
  );
}

function mapFieldsDataToJsx(fields, hasSuccess, isLoading, handleChange, formName, isActive) {
  return fields.map((field, index) => {
    const { name, value, placeholder, hasProblem, iconClass, helpText } = field;
    const inputId = `${name}-input-${formName}-form`;
    return (
      <div className="field">
        <label className="label" htmlFor={inputId}>
          Create a username
        </label>
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