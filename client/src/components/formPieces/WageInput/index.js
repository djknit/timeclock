import React from 'react';
import ccData from 'currency-codes/data';
import getStyle from './style';
import SelectInput from '../SelectInput';
import CurrencyInput from '../CurrencyInput';
import RadioInput from '../RadioInput';
import OvertimeInput from './OvertimeInput';

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
  ).filter(
    _data => _data.value !== 'XTS' && _data.value !== 'XXX'
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
  radioUseWageTrueRef,
  radioUseWageFalseRef,
  radioUseOvertimeTrueRef,
  radioUseOvertimeFalseRef,
  radioUseMultiplierTrueRef,
  radioUseMultiplierFalseRef,
  windowWidth,
  topLevelFieldLabelRatio
}) {

  const { rate, currency, overtime, useWage } = value;

  function changeReporterFactory(_handleChange, sectionPropName, sectionValue) {
    return function(event) {
      let _value = { ...sectionValue };
      _value[event.target.name] = event.target.value;
      _handleChange({
        target: {
          name: sectionPropName,
          value: _value
        }
      });
    };
  }

  const reportChange = changeReporterFactory(handleChange, name, value);

  const style = getStyle();

  const secondLevelFieldLabelRatio = 4.7;

  return (
    <>
      <div className="label" style={style.sectionLabel}>
        &nbsp;
        <span style={style.sectionLabelText}>Wage</span>
        <hr style={style.sectionLabelHr} />
      </div>
      <div>
        <RadioInput
          name="useWage"
          sectionName={name}
          value={useWage}
          label="Track Pay?"
          options={[
            {
              value: true,
              label: 'Yes',
              ref: radioUseWageTrueRef
            }, {
              value: false,
              label: 'No',
              ref: radioUseWageFalseRef
            }
          ]}
          handleChange={reportChange}
          isInline
          hasProblem={problems && problems.useWage}
          fieldToLabelRatio={topLevelFieldLabelRatio}
          {...{ isActive }}
        />
        <SelectInput
          name="currency"
          sectionName={name}
          value={currency}
          options={currencyOptions}
          handleChange={reportChange}
          label="Currency:"
          placeholder="Select currency..."
          helpText='Select "other" (1st option) to skip or if you need to enter values smaller than the currency typically supports (e.g. fractions of a cent in USD).'
          hasProblem={problems && problems.currency}
          {...{ formId }}
          isInline
          isActive={isActive && useWage}
          fieldToLabelRatio={secondLevelFieldLabelRatio}
        />
        <CurrencyInput
          name="rate"
          sectionName={name}
          value={rate}
          label="Hourly Rate:"
          placeholder="Pay per hour..."
          hasProblem={problems && problems.rate}
          handleChange={reportChange}
          {...{
            formId,
            currency
          }}
          isInline
          isActive={isActive && useWage}
          fieldToLabelRatio={secondLevelFieldLabelRatio}
        />
        <OvertimeInput
          name="overtime"
          sectionName={name}
          value={overtime}
          hasProblem={problems && problems.overtime}
          problems={(problems && problems.overtime) || {}}
          reportChange={changeReporterFactory(reportChange, 'overtime', overtime)}
          {...{
            formId,
            radioUseOvertimeTrueRef,
            radioUseOvertimeFalseRef,
            radioUseMultiplierTrueRef,
            radioUseMultiplierFalseRef,
            currency,
            secondLevelFieldLabelRatio
          }}
          isActive={isActive && useWage}
          rawBaseRate={rate}
        />
      </div>
    </>
  );
}

export default WageInput;