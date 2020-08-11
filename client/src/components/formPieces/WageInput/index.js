import React from 'react';
import ccData from 'currency-codes/data';
import getStyle from './style';
import { changeHandlerFactoryForChildrenFactory } from '../../utilities';
import SelectInput from '../SelectInput';
import CurrencyInput from '../CurrencyInput';
import RadioInput from '../RadioInput';
import OvertimeInput from './OvertimeInput';
import CollapsableSection from '../CollapsableSection';

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
  propName,
  value,
  hasProblem,
  problems,
  changeHandlerFactory,
  isActive,
  formId,
  refs,
  // radioUseWageTrueRef,
  // radioUseWageFalseRef,
  // radioUseOvertimeTrueRef,
  // radioUseOvertimeFalseRef,
  // radioUseMultiplierTrueRef,
  // radioUseMultiplierFalseRef,
  topLevelFieldLabelRatio,
  secondLevelFieldLabelRatio,
  contentToggle
}) {

  const { rate, currency, overtime, useWage } = value;

  const reportChange = changeHandlerFactory(propName, false);

  const changeHandlerFactoryForChildren = changeHandlerFactoryForChildrenFactory(
    function(childPropName, childPropValue) {
      let _value = { ...value };
      _value[childPropName] = childPropValue;
      reportChange(_value);
    }
  );

  const style = getStyle();

  const { isExpanded } = contentToggle || {};

  const areInsideInputsActive = isActive && useWage && isExpanded;

  return (
    <CollapsableSection
      label="Wage"
      outsideContent={
        <RadioInput
          propName="useWage"
          sectionName={propName}
          value={useWage}
          label="Track Pay?"
          options={[
            {
              value: true,
              label: 'Yes',
              ref: refs.radioUseWageTrue
            }, {
              value: false,
              label: 'No',
              ref: refs.radioUseWageFalse
            }
          ]}
          changeHandlerFactory={changeHandlerFactoryForChildren}
          isInline
          hasProblem={problems && problems.useWage}
          fieldToLabelRatio={topLevelFieldLabelRatio}
          {...{ isActive }}
          fieldStyle={style.useWageInputField}
        />
      }
      {...{ contentToggle }}
    >
      <SelectInput
        propName="currency"
        sectionName={propName}
        value={currency}
        options={currencyOptions}
        changeHandlerFactory={changeHandlerFactoryForChildren}
        label="Currency:"
        placeholder="Select currency..."
        helpText='Select "other" (1st option) to skip or if you need to enter values smaller than the currency typically supports (e.g. fractions of a cent in USD).'
        hasProblem={problems && problems.currency}
        {...{ formId }}
        isInline
        isActive={areInsideInputsActive}
        fieldToLabelRatio={secondLevelFieldLabelRatio}
        fieldStyle={style.firstInputInSection}
      />
      <CurrencyInput
        propName="rate"
        sectionName={propName}
        value={rate}
        label="Hourly Rate:"
        placeholder="Pay per hour..."
        hasProblem={problems && problems.rate}
        changeHandlerFactory={changeHandlerFactoryForChildren}
        {...{
          formId,
          currency
        }}
        isInline
        isActive={areInsideInputsActive}
        fieldToLabelRatio={secondLevelFieldLabelRatio}
      />
      <OvertimeInput
        propName="overtime"
        sectionName={propName}
        value={overtime}
        hasProblem={problems && problems.overtime}
        problems={(problems && problems.overtime) || {}}
        changeHandlerFactory={changeHandlerFactoryForChildren}
        {...{
          formId,
          // radioUseOvertimeTrueRef,
          // radioUseOvertimeFalseRef,
          // radioUseMultiplierTrueRef,
          // radioUseMultiplierFalseRef,
          currency,
          secondLevelFieldLabelRatio,
          refs
        }}
        isActive={areInsideInputsActive}
        rawBaseRate={rate}
      />
    </CollapsableSection>
  );
}

export default WageInput;