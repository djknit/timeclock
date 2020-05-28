import React, { Component } from 'react';
import getStyle from './style';
import BoxInputFrame from '../BoxInputFrame';

function CurrencyInput({
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
  inputRef,
  isInline
}) {

  const inputId = `${name}-input-${formId}`;

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
        className={hasProblem ? 'input is-danger' : 'input'}
        type="number"
        style={style.input}
        value={value.raw}
        onChange={handleChange}
        disabled={!isActive}
        ref={inputRef}
        {...{
          name,
          placeholder
        }}
      />
      <span className="icon is-left">$</span>
      {
        (value.display === 'negative' && (
          <div style={style.amountDisplayNegative}>
            Negative values are not allowed
          </div>
        )) || (value.display !== null && (
          <div style={style.amountDisplay}>
            $ {value.display}
          </div>
        ))
      }
      {helpText &&
        <p className="help">{helpText}</p>
      }
    </BoxInputFrame>
  );
}

export default CurrencyInput;