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

function convertAmPmTimeTo24hr(timeToConvert) {
  // Note: now keeping `amPm` value when time is changed to 24hr so it can be used when switching back to AM/PM if amPm value is not determined by 24hr hour input value
  const { is24hr, amPm, hour } = timeToConvert;
  if (is24hr) return timeToConvert;
  if (isNaN(parseInt(hour)) || hour <= 0 || hour > 12) {
    return {
      ...timeToConvert,
      is24hr: true
    };
  }
  return {
    ...timeToConvert,
    is24hr: true,
    hour: (hour % 12) + (amPm === 'pm' ? 12 : 0)
  };
}

function convert24hrTimeToAmPm(timeToConvert) {
  const { hour, is24hr } = timeToConvert
  if (!is24hr) return timeToConvert;
  if (isNaN(parseInt(hour)) || hour < 0 || hour >= 24) {
    return {
      ...timeToConvert,
      is24hr: false
    };
  }
  return {
    ...timeToConvert,
    is24hr: false,
    amPm: hour >= 12 ? 'pm' : 'am',
    hour: (hour % 12) || 12
  };
}

export {
  getMinutesFromHoursAndMinutes,
  getHoursAndMinutesFromMinutes,
  getTextOfHoursAndMinutes,
  getWeekdays,
  getWeekdayOptions,
  convertAmPmTimeTo24hr,
  convert24hrTimeToAmPm
};
