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

function convertAmPmTimeTo24hr(_amPmTime) {
  let _24hrTime = {
    is24hr: true,
    amPm: undefined,
    minute: _amPmTime.minute
  };
  let _hour = _amPmTime.hour;
  if (!_hour && _hour !== 0) {
    _24hrTime.hour = undefined;
    return _24hrTime;
  }
  if (_hour === 12) {
    _hour = 0;
  }
  if (_amPmTime.amPm === 'pm' && _hour >= 0 && _hour < 12) {
    _hour += 12;
  }
  _24hrTime.hour = _hour;
  return _24hrTime;
}

function convert24hrTimeToAmPm(_24hrTime) {
  let _amPmTime = {
    is24hr: false,
    minute: _24hrTime.minute
  };
  const _hour = _24hrTime.hour;
  if ((!_hour && _hour !== 0) || _hour < 0 || _hour > 23) {
    return {
      ..._amPmTime,
      hour: _hour,
      amPm: 'am'
    };
  }
  return {
    ..._amPmTime,
    amPm: _hour >= 12 ? 'pm' : 'am',
    hour: (_hour % 12) || 12
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
