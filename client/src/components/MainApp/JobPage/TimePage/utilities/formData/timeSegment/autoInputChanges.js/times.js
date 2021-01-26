function afterTimeInputChange(propName, childPropName, comp) {
  return new Promise(resolve => {
    const { state } = comp;
    if (!isTimeBlank(state[getOtherTimeInputPropName(propName)])) { // no autochange unless other input is empty
      return resolve(false);
    }
    let additionalChanges;
    if (childPropName === 'is24hr') {
      additionalChanges = getCompleteChangesAfterIs24HrChange(propName, state);
    }
    else if (didChangeAffectAmPm(propName, childPropName, state)) {
      additionalChanges = getCompleteChangesAfterAmPmChange(propName, state);
    }
    if (additionalChanges) {
      return comp.setState(additionalChanges, () => resolve(true));
    }
    resolve(false);
  });
}

function isTimeBlank(timeInputVal) {
  return isNaN(parseInt(timeInputVal.hour)) && isNaN(parseInt(timeInputVal.minute));
}

function getOtherTimeInputPropName(propName) {
  return propName === 'startTime' ? 'endTime' : 'startTime';
}

function getCompleteChangesAfterIs24HrChange(propName, compState) {
  const otherPropName = getOtherTimeInputPropName(propName);
  const { is24hr } = compState[propName];
  if (compState[otherPropName].is24hr !== is24hr) {
    return {
      [otherPropName]: { ...compState[otherPropName], is24hr }
    };
  }
}

function didChangeAffectAmPm(propName, childPropName, compState) {
  const { is24hr, hour } = compState[propName];
  return (
    childPropName === 'amPm' ||
    (childPropName === 'hour' && is24hr && hour >= 0 && hour < 24)
  );
}

function getCompleteChangesAfterAmPmChange(propName, compState) {
  const otherPropName = getOtherTimeInputPropName(propName);
  const otherInputVal = compState[otherPropName];
  const { amPm } = compState[propName];
  if (otherInputVal.amPm === amPm) return;
  if (
    compState.startTime.amPm === 'pm' ||
    otherInputVal.amPm !== otherInputVal._naturalAmPm
  ) {
    return {
      [otherPropName]: { ...otherInputVal, amPm }
    };
  }
}

export { afterTimeInputChange };
