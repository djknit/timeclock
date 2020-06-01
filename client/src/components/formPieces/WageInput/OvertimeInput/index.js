import React from 'react';
import RadioInput from '../../RadioInput';
import CurrencyInput from '../../CurrencyInput';
import TextInput from '../../TextInput';

function OvertimeInput({
  name,
  sectionName,
  value,
  hasProblem,
  problems,
  reportChange,
  isActive,
  currency,
  radioUseOvertimeTrueRef,
  radioUseOvertimeFalseRef,
  radioUseMultiplierTrueRef,
  radioUseMultiplierFalseRef,
  formId,
  rawRate
}) {

  const thisSectionName = `${sectionName}-${name}`;

  const { useOvertime, useMultiplier, multiplier, rate, cutoff } = value;

  const rateInputTypeDependentProps = (
    useMultiplier ?
    {
      name: 'multiplier',
      value: multiplier,
      label: 'Multiplier:',
      placeholder: 'OT rate multiplier...',
      hasProblem: problems && problems.multiplier,
      isMultiplier: true,
      wageToMultiply: rawRate
    } :
    {
      name: 'rate',
      value: rate,
      label: 'Overtime Rate:',
      placeholder: 'Pay per OT hour...',
      hasProblem: problems && problems.rate
    }
  );
  const rateInputProps = {
    ...rateInputTypeDependentProps,
    sectionName: thisSectionName,
    handleChange: reportChange,
    isActive: isActive && useOvertime,
    formId,
    isInline: true,
    currency
  };

  return (
    <>
      <RadioInput
        name="useOvertime"
        sectionName={thisSectionName}
        value={useOvertime}
        label="Overtime:"
        options={[
          {
            value: true,
            label: 'On',
            ref: radioUseOvertimeTrueRef
          }, {
            value: false,
            label: 'Off',
            ref: radioUseOvertimeFalseRef
          }
        ]}
        hasProblem={problems && problems.useOvertime}
        handleChange={reportChange}
        isInline
        {...{ isActive }}
      />
      <RadioInput
        name="useMultiplier"
        sectionName={thisSectionName}
        value={useMultiplier}
        label="Use Multiplier?"
        options={[
          {
            value: true,
            label: 'Yes',
            ref: radioUseMultiplierTrueRef
          }, {
            value: false,
            label: 'No',
            ref: radioUseMultiplierFalseRef
          }
        ]}
        hasProblem={problems && problems.useMultiplier}
        handleChange={reportChange}
        isInline
        isSubsection
        isActive={isActive && useOvertime}
      />
      <CurrencyInput {...rateInputProps} />
      <CurrencyInput

      />
    </>
  );
}

export default OvertimeInput;