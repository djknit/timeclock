function getDayCutoffInputProblems(inputValue, problemMessages) {
  if (!inputValue) {
    problemMessages.push('Missing day cutoff time.');
    return {
      hour: true,
      minute: true
    };
  }
  const { hour, minute } = inputValue;
  if (!hour && hour !== 0) {
    problemMessages.push('You must select the hour of the day cutoff time.');
    return { hour: true };
  }
  const valueInMinutes = hour * 60 + (minute || 0);
  if (Math.abs(valueInMinutes) > 12 * 60) {
    problemMessages.push(
      'Invalid day cutoff: can\'t be moved more than 12 hrs in either direction from the actual start of the day (midnight).'
    );
    return {
      hour: true,
      minute: true
    };
  }
}

function processDayCutoffInput(inputValue) {
  const { hour, minute } = inputValue;
  const valueInMinutes = hour * 60 + (minute || 0);
  return valueInMinutes * 60 * 1000;
}

export {
  getDayCutoffInputProblems,
  processDayCutoffInput
};