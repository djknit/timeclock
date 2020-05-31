import React, { Component } from 'react';
import getStyle from './style';
import BoxInputFrame from '../BoxInputFrame';
import { processCurrencyInputValue } from '../../utilities';

function CurrencyInput({
  name,
  value,
  label,
  sublabel,
  placeholder,
  hasProblem,
  helpText,
  handleChange,
  isActive,
  formId,
  inputRef,
  isInline,
  currency
}) {

  const inputId = `${name}-input-${formId}`;

  const style = getStyle();

  const processedValue = processCurrencyInputValue(value, currency);

  let currencySymbol;
  if (currency === 'USD') currencySymbol = '$';
  else if (currency === 'EUR') currencySymbol = <>&euro;</>;
  else if (currency === 'GBP') currencySymbol = <>&pound;</>;
  else if (currency === 'JPY') currencySymbol = <>&yen;</>;

  return (
    <BoxInputFrame
      {...{
        label,
        inputId,
        sublabel,
        isInline
      }}
      hasIcon={currencySymbol ? 'left' : false}
    >
      <input
        id={inputId}
        className={hasProblem ? 'input is-danger' : 'input'}
        type="number"
        style={style.input}
        onChange={handleChange}
        disabled={!isActive}
        ref={inputRef}
        {...{
          name,
          placeholder,
          value
        }}
      />
      {currencySymbol &&
        <span className="icon is-left">
          {currencySymbol}
        </span>
      }
      {
        (processedValue.display === 'negative' && (
          <div style={style.amountDisplayNegative}>
            Negative values are not allowed
          </div>
        )) || (processedValue.display !== null && (
          <div style={style.amountDisplay}>
            $ {processedValue.display}
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