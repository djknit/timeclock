import React from 'react';
import { changeHandlerFactoryForChildrenFactory } from '../../../utilities';
import RadioInput from '../../RadioInput';
import CurrencyInput from '../../CurrencyInput';
import TextInput from '../../TextInput';
import TimeInput from '../../TimeInput';

function OvertimeInput({
  propName,
  sectionName,
  value,
  hasProblem,
  problems,
  changeHandlerFactory,
  isActive,
  currency,
  radioUseOvertimeTrueRef,
  radioUseOvertimeFalseRef,
  radioUseMultiplierTrueRef,
  radioUseMultiplierFalseRef,
  formId,
  rawBaseRate,
  secondLevelFieldLabelRatio
}) {

  const thisSectionName = `${sectionName}-${propName}`;

  const { useOvertime, useMultiplier, multiplier, rate, cutoff } = value;

  const reportChange = changeHandlerFactory(propName, false);

  const changeHandlerFactoryForChildren = changeHandlerFactoryForChildrenFactory(
    function(childPropName, childPropValue) {
      let _value = { ...value };
      _value[childPropName] = childPropValue;
      reportChange(_value);
    }
  );

  const thirdLevelFieldLabelRatio = 3.5;

  const rateInputTypeDependentProps = (
    useMultiplier ?
    {
      propName: 'multiplier',
      value: multiplier,
      label: 'Multiplier:',
      placeholder: 'OT rate multiplier...',
      hasProblem: problems && problems.multiplier,
      isMultiplier: true,
      wageToMultiply: {
        rate: rawBaseRate,
        currency
      }
    } :
    {
      propName: 'rate',
      value: rate,
      label: 'Overtime Rate:',
      placeholder: 'Pay per OT hour...',
      hasProblem: problems && problems.rate
    }
  );
  const rateInputProps = {
    ...rateInputTypeDependentProps,
    sectionName: thisSectionName,
    changeHandlerFactory: changeHandlerFactoryForChildren,
    isActive: isActive && useOvertime,
    formId,
    isInline: true,
    currency,
    isSubsection: true,
    fieldToLabelRatio: thirdLevelFieldLabelRatio
  };

  return (
    <>
      <RadioInput
        propName="useOvertime"
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
        changeHandlerFactory={changeHandlerFactoryForChildren}
        isInline
        {...{ isActive }}
        fieldToLabelRatio={secondLevelFieldLabelRatio}
        helpText='If overtime is "off" all hours will be assigned the same pay rate regardless of the number of hours worked in that week.'
      />
      <RadioInput
        propName="useMultiplier"
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
        changeHandlerFactory={changeHandlerFactoryForChildren}
        isInline
        isSubsection
        isActive={isActive && useOvertime}
        fieldToLabelRatio={thirdLevelFieldLabelRatio}
        helpText="OT pay  rate can either be a multiple of the base rate, or you may enter the exact hourly OT rate instead."
      />
      <CurrencyInput {...rateInputProps} />
      <TimeInput
        propName="cutoff"
        sectionName={thisSectionName}
        value={cutoff}
        max={10079}
        min={1}
        label="OT cutoff:"
        hasProblem={problems && problems.cutoff}
        problems={problems && problems.cutoff}
        changeHandlerFactory={changeHandlerFactoryForChildren}
        isInline
        isSubsection
        isActive={isActive && useOvertime}
        fieldToLabelRatio={thirdLevelFieldLabelRatio}
        helpText="How many hours need to be worked in a week before overtime kicks in?"
      />
    </>
  );
}

export default OvertimeInput;