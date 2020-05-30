import React from 'react';
import ccData from 'currency-codes/data';
import SelectInput from '../SelectInput';
import CurrencyInput from '../CurrencyInput'; 

const currencyOptions = [
  {
    name: 'Other',
    value: 'X'
  },
  ...ccData.map(
    (_data) => ({
      name: `${_data.currency} (${_data.code})`,
      value: _data.code
    })
  )
];

function WageInput({
  name,
  value,
  hasProblem,
  problems,
  handleChange,
  isActive,
  formId,
}) {

  const { rate, currency, useOvertime, overtime } = value;

  function reportChange(event) {
    let _value = { ...value };
    _value[event.target.name] = event.target.value;
    handleChange({
      target: {
        name,
        value: _value
      }
    });
  }

  return (
    <fieldset>
      <legend className="label">Wage</legend>
      <SelectInput
        name="currency"
        value={currency}
        options={currencyOptions}
        handleChange={reportChange}
        label="Currency:"
        placeholder="Select currency..."
        helpText='Select "other" to skip or if you need to enter values smaller than the currency you use typically supports (e.g. fractions of a cent in USD).'
        hasProblem={problems && problems.currency}
        {...{
          isActive,
          formId
        }}
        isInline
      />
      <CurrencyInput
        name="rate"
        value={rate}
        label="Hourly Rate:"
        placeholder="Pay per hour..."
        hasProblem={problems && problems.rate}
        handleChange={reportChange}
        {...{
          isActive,
          formId,
          currency
        }}
        isInline
      />
    </fieldset>
  );
}

export default WageInput;