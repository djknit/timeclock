import { timeSegInputConstants } from './elemental';

const { inputFieldMarginBottom, sectionLabelMarginBottom } = timeSegInputConstants;

function extractTimeSegmentInputsProps(formMgmtComp) {
  const {
    changeHandlerFactory,
    firstInputArea,
    firstInputAreaLabel,
    handleDatepickerPopperToggle
  } = formMgmtComp;
  const {
    inputRef
  } = formMgmtComp.props;
  const {
    hasSuccess,
    hasWarning,
    isLoading,
    problems,
  } = formMgmtComp.state;

  const _getChildInputProps = propName => ({
    propName,
    problems: problems[propName],
    hasProblem: !!problems[propName],
    value: formMgmtComp.state[propName]
  });

  const isUserActionAllowed = !isLoading && !hasWarning && !hasSuccess;

  const _getCommonDateTimeInputProps = startOrEnd => ({
    changeHandlerFactory,
    isActive: isUserActionAllowed,
    handleDatepickerPopperToggle,
    timeInputProps: _getChildInputProps(`${startOrEnd}Time`),
    dateInputProps: _getChildInputProps(`${startOrEnd}Date`),
    sectionName: `segment-${startOrEnd}`,
    inputFieldMarginBottom,
    sectionLabelMarginBottom
  });

  return {
    firstInputArea: { ref: firstInputArea },
    firstInput: {
      sectionLabel: 'Time Segment Start (Clock-In)',
      inputRef,
      ..._getCommonDateTimeInputProps('start'),
      labelAreaRef: firstInputAreaLabel
    },
    lastInput: {
      sectionLabel: `Time Segment End (Clock-Out)`,
      ..._getCommonDateTimeInputProps('end'),
      isLast: true
    }
  };
}

export {
  extractTimeSegmentInputsProps
};
