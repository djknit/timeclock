import { constants } from '../../../../utilities';

const { minsPerHr, secsPerMin } = constants;

function getDayCutoffInputProblems(inputValue, problemMessages) {
  if (!inputValue) {
    problemMessages.push('Missing day cutoff time.');
    return {
      hour: true,
      minute: true
    };
  }
  const { hour, minute = 0 } = inputValue;
  if (!hour && hour !== 0) {
    problemMessages.push('You must select the hour of the day cutoff time.');
    return { hour: true };
  }
  if (minute < 0 || minute >= minsPerHr) {
    problemMessages.push('Invalid day cutoff time: invalid minutes.');
    return { minute: true };
  }
  const valueInMinutes = hour * minsPerHr + minute;
  if (Math.abs(valueInMinutes) > 12 * minsPerHr) {
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
  const valueInMinutes = hour * minsPerHr + (minute || 0);
  return valueInMinutes * secsPerMin * 1000;
}

export {
  getDayCutoffInputProblems,
  processDayCutoffInput
};