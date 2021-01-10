import {
  getMinutesFromHoursAndMinutes, getTextOfHoursAndMinutes, getHoursAndMinutesFromMinutes
} from '../../utilities';

function getCompleteProblems({ problems, value, hasProblem }) {
  const numMinutes = getMinutesFromHoursAndMinutes({ hours: value.hour, minutes: value.minute });
  let completeProblems = (
    problems ?
    { ...problems } :
    (hasProblem ? { hour: true, minute: true } : {})
  );
  let problemMessages = [];
  const max = 12 * 60;
  const min = -1 * max;
  if (numMinutes > max) {
    completeProblems.hour = completeProblems.minute = true;
    const maxTimeText = getTextOfHoursAndMinutes(getHoursAndMinutesFromMinutes(max));
    problemMessages.push(`Invalid time: can't be greater than ${maxTimeText}.`);
  }
  else if (numMinutes < min) {
    completeProblems.hour = completeProblems.minute = true;
    const minTimeText = getTextOfHoursAndMinutes(getHoursAndMinutesFromMinutes(0));
    problemMessages.push(`Invalid time: can't be less than ${minTimeText}.`);
  }
  if (value.minute < 0 || value.minute >= 60) {
    completeProblems.minute = true;
    problemMessages.push('Invalid minutes: can\'t be less than 0 or greater than 59.');
  }
  return {
    problems: completeProblems,
    problemMessages
  };
}

function getCutoffDisplayValue(value) {
  const { hour, minute } = value;
  let hourValueToDisplay, minuteValueToDisplay;
  if (hour < 0) {
    hourValueToDisplay = minute ? Math.abs(hour) - 1 : Math.abs(hour);
    minuteValueToDisplay = minute ? 60 - minute : 0;
  }
  else {
    hourValueToDisplay = hour;
    minuteValueToDisplay = minute || 0;
  }
  const hourDisplay = hourValueToDisplay < 10 ? `0${hourValueToDisplay}` : hourValueToDisplay;
  const minuteDisplay = minuteValueToDisplay < 10 ? `0${minuteValueToDisplay}` : minuteValueToDisplay;
  return `(${hour < 0 ? '-' : '+'}${hourDisplay}:${minuteDisplay})`;
}

export {
  getCompleteProblems,
  getCutoffDisplayValue
};
