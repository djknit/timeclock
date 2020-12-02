import { constants } from '../../../../utilities';

const { minsPerHr } = constants;

function getMinutesFromHoursAndMinutes({ hours, minutes }) {
  return (hours || 0) * minsPerHr + (minutes || 0);
}

function getHoursAndMinutesFromMinutes(numMinutes) {
  const _numMinutes = numMinutes || 0;
  return {
    hours: Math.floor(_numMinutes / minsPerHr),
    minutes: _numMinutes % minsPerHr
  };
}

function getTextOfHoursAndMinutes({ hours, minutes}) {
  let timeText = `${hours || 0} hour`;
  if (parseInt(hours) !== 1) timeText += 's';
  timeText += ` and ${minutes || 0} minute`;
  if (parseInt(minutes) !== 1) timeText += 's';
  return timeText;
}

const getWeekdays = () => (
  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
);

const getWeekdayOptions = () => (
  getWeekdays()
  .map(
    (dayName, index) => ({
      name: dayName,
      value: index
    })
  )
);

export {
  getMinutesFromHoursAndMinutes,
  getHoursAndMinutesFromMinutes,
  getTextOfHoursAndMinutes,
  getWeekdays,
  getWeekdayOptions
};