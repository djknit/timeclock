import React from 'react';
import getStyle from './style';
import BoxInputFrame from '../BoxInputFrame';
import {
  processCurrencyInputValue, processCurrencyMultiplierInputValue, getCurrencySymbol, getInputId
} from '../../utilities';

function CurrencyInput({
  propName,
  sectionName,
  value,
  label,
  sublabel,
  placeholder,
  hasProblem,
  helpText,
  changeHandlerFactory,
  isActive,
  formId,
  inputRef,
  isInline,
  currency,
  showCurrencyCode,
  isMultiplier,
  wageToMultiply,
  fieldToLabelRatio,
  inputId: inputIdProp
}) {

  const inputId = inputIdProp || getInputId(formId, propName, sectionName);

  const style = getStyle();

  const processedValue = (
    isMultiplier ?
    processCurrencyMultiplierInputValue(value, wageToMultiply) :
    processCurrencyInputValue(value, currency)
  );

  const currencySymbol = isMultiplier ? undefined : getCurrencySymbol(currency);

  return (
    <BoxInputFrame
      {...{
        label,
        inputId,
        sublabel,
        isInline,
        fieldToLabelRatio,
        helpText
      }}
      hasIcon={currencySymbol ? 'left' : false}
    >
      <input
        id={inputId}
        className={hasProblem ? 'input is-danger' : 'input'}
        type="number"
        style={style.input}
        onChange={changeHandlerFactory(propName, true)}
        disabled={!isActive}
        ref={inputRef}
        {...{
          placeholder,
          value
        }}
      />
      {currencySymbol && (
        <span className="icon is-left">
          {currencySymbol}
        </span>
      )}
      <div style={style.amountDisplay}>
        {(processedValue.display === 'negative' && (
          <span style={style.displayTextNegative}>
            Negative values are not allowed
          </span>
        )) ||
        (processedValue.display !== null && (
          <span style={style.displayText}>
            {processedValue.display} {showCurrencyCode && currency !== 'X' && ` ${currency}`}
          </span>
        ))}
      </div>
    </BoxInputFrame>
  );
}

export default CurrencyInput;
