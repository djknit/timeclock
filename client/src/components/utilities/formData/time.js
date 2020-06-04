function getMinutesFromHoursAndMinutes({ hours, minutes }) {
  return (hours || 0) * 60 + (minutes || 0);
}

function getHoursAndMinutesFromMinutes(numMinutes) {
  const _numMinutes = numMinutes || 0;
  return {
    hours: Math.floor(_numMinutes / 60),
    minutes: _numMinutes % 60
  };
}

function getTextOfHoursAndMinutes({ hours, minutes}) {
  let timeText = hours ? `${hours} hour` : '';
  if (hours === 1) timeText += 's';
  if (minutes) timeText += ` and ${minutes} minute`;
  if (minutes === 1) timeText += 's';
  return timeText;
}

export {
  getMinutesFromHoursAndMinutes,
  getHoursAndMinutesFromMinutes,
  getTextOfHoursAndMinutes
};