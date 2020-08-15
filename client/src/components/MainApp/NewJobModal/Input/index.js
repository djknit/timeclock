import React from 'react';
import { getTimezoneOptions } from '../../utilities'
import { TextInput, SelectInput, WageInput, DateInput, WkDayCutoffsInput } from '../../../formPieces';

function getInput(propName) {
  function _getInputInfoObj(Comp, label, placeholder, helpText, otherAttrs) {
    const inputSpecificAttrs = { label, placeholder, helpText, ...otherAttrs };
    return { Comp, inputSpecificAttrs };
  }
  switch (propName) {
    case 'name':
      return _getInputInfoObj(TextInput, 'Name:', 'Name this job...');
    case 'startDate':
      return _getInputInfoObj(
        DateInput,
        'Start Date:',
        'Type or select date...',
        'Time can still be entered from before start date, so don\'t worry if you need to guess.'
      );
    case 'timezone':
      return _getInputInfoObj(
        SelectInput,
        'Timezone:',
        'The timezone your hours are counted in...',
        undefined,
        { options: getTimezoneOptions() }
      );
    case 'wage':
      return _getInputInfoObj(WageInput);
    case 'cutoffs':
      return _getInputInfoObj(WkDayCutoffsInput)
  }
};

function Input({
  propName,
  wageContentToggle,
  cutoffsContentToggle,
  problems,
  topLevelFieldLabelRatio,
  secondLevelFieldLabelRatio,
  wageInputRefs,
  wkDayCutoffsInputRefs,
  ...otherProps
}) {

  let attributes = {
    ...otherProps,
    propName,
    hasProblem: problems
  };

  const isWage = propName === 'wage';
  if (isWage || propName === 'cutoffs') {
    Object.assign(
      attributes,
      { topLevelFieldLabelRatio, secondLevelFieldLabelRatio, problems }
    );
    attributes.refs = isWage ? wageInputRefs : wkDayCutoffsInputRefs;
    attributes.contentToggle = isWage ? wageContentToggle : cutoffsContentToggle;
  }
  else {
    attributes.fieldToLabelRatio = topLevelFieldLabelRatio;
    attributes.isInline = true;
  }

  const { Comp, inputSpecificAttrs } = getInput(propName);

  return (
    <Comp {...attributes} {...inputSpecificAttrs} />
  );
}

export default Input;